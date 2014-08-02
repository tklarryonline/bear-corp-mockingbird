from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from speeches.forms import SpeechForm
from speeches.models import Speech
from speeches.serializers import SpeechSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework import generics
from django.contrib.auth.models import User
import time


@csrf_exempt
def submit_silent(request):
    if request.method == 'POST':
        if 'title' not in request.POST or request.POST['title'] == '':
            request.POST['title'] = request.user.username + '_' + str(time.time())
        if 'fname' not in request.POST:
            request.POST['fname'] = request.POST['title']
        if 'accuracy' not in request.POST:
            request.POST['accuracy'] = 0.0
        if 'pacing' not in request.POST:
            request.POST['pacing'] = 0.0
        if 'transcription' not in request.POST:
            request.POST['transcription'] = ''
        title = request.POST['fname']
        filefield = request.FILES['data']
        transcription = request.POST['transcription']
        owner = request.user
        accuracy = request.POST['accuracy']
        pacing = request.POST['pacing']
        speech = Speech(title=title, filefield=filefield, transcription=transcription, owner=owner,
                accuracy=accuracy, pacing=pacing)
        speech.save()

    return HttpResponseRedirect('/accounts/profile')

@csrf_exempt
def submit(request):
    if request.method == 'POST':
        if 'accuracy' not in request.POST:
            request.POST['accuracy'] = 0.0
        if 'pacing' not in request.POST:
            request.POST['pacing'] = 0.0
        if 'transcription' not in request.POST:
            request.POST['transcription'] = ''
        if 'title' not in request.POST or request.POST['title'] == '':
            request.POST['title'] = request.user.username + '_' + str(time.time())
        title = request.POST['title'] + '_' + str(time.time())
        filefield = request.FILES['audio']
        owner = request.user
        speech = Speech(title=title, filefield=filefield, owner=owner)
        speech.save()

    return HttpResponse('200')

@csrf_exempt
def dummy(request):
    print request
    return HttpResponse(str(request))

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)
        
class SpeechesList(generics.ListCreateAPIView):
    queryset = Speech.objects.all()
    serializer_class = SpeechSerializer

    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(SpeechesList, self).dispatch(*args, **kwargs)

    def pre_save(self, obj):
        obj.owner = self.request.user

    @csrf_exempt
    def post(self, obj):
        #data = JSONParser().parse(self.request.DATA)
        #serializer = SpeechSerializer(data=self.request.DATA)
        #print serializer
        #if serializer.is_valid():
        #    serializer.save()
        #    return JSONResponse(serializer.data, status=201)
        #return JSONResponse(serializer.errors, status=400)
        #print self.request.META
        #return HttpResponse(str(self.request))
        return HttpResponse('ads')

class SpeechDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Speech.objects.all()
    serializer_class = SpeechSerializer
    def pre_save(self, obj):
        obj.owner = self.request.user


#class SpeechesList(APIView):
#    def get(self, request, format=None):
#        snippets = Speech.objects.all()
#        serializer = SpeechSerializer(snippets, many=True)
#        return Response(serializer.data)
#
#    def post(self, request, format=None):
#        serializer = SpeechSerializer(data=request.DATA)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#class SpeechDetail(APIView):
#
#    def get_object(self, pk):
#        try:
#            return Speech.objects.get(pk=pk)
#        except Speech.DoesNotExist:
#            raise Http404
#
#    def get(self, request, pk, format=None):
#        snippet = self.get_object(pk)
#        serializer = SpeechSerializer(snippet)
#        return Response(serializer.data)
#
#    def put(self, request, pk, format=None):
#        snippet = self.get_object(pk)
#        serializer = SpeechSerializer(snippet, data=request.DATA)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#    def delete(self, request, pk, format=None):
#        snippet = self.get_object(pk)
#        snippet.delete()
#        return Response(status=status.HTTP_204_NO_CONTENT)
#
def upload_file(request):
    if request.method == 'POST':
        form = SpeechForm(request.POST, request.FILES)
        if form.is_valid():
            # file is saved
            form.save()
            return HttpResponseRedirect('/accounts/profile/')
    else:
        form = SpeechForm()
    return render(request, 'accounts/speeches.html', {'form': form})

# Create your views here.

#class JSONResponse(HttpResponse):
#    """
#    An HttpResponse that renders its content into JSON.
#    """
#    def __init__(self, data, **kwargs):
#        content = JSONRenderer().render(data)
#        kwargs['content_type'] = 'application/json'
#        super(JSONResponse, self).__init__(content, **kwargs)
#
#@csrf_exempt
#def speeches_list(request):
#    """
#    List all speeches
#    """
#    if request.method == 'GET':
#        snippets = Speech.objects.all()
#        serializer = SpeechSerializer(snippets, many=True)
#        return JSONResponse(serializer.data)
#
#    elif request.method == 'POST':
#        data = JSONParser().parse(request)
#        serializer = SpeechSerializer(data=data)
#        if serializer.is_valid():
#            serializer.save()
#            return JSONResponse(serializer.data, status=201)
#        return JSONResponse(serializer.errors, status=400)
#
#@csrf_exempt
#def speech_detail(request, pk):
#    """
#    Retrieve, update or delete a speech.
#    """
#    try:
#        speech = Speech.objects.get(pk=pk)
#    except Speech.DoesNotExist:
#        return HttpResponse(status=404)
#
    if request.method == 'GET':
        serializer = SpeechSerializer(speech)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = SpeechSerializer(speech, data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        speech.delete()
        return HttpResponse(status=204)
