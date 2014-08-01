from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from speeches.forms import SpeechForm
from speeches.models import Speech
from speeches.serializers import SpeechSerializer

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

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
def speeches_list(request):
    """
    List all speeches
    """
    if request.method == 'GET':
        snippets = Speech.objects.all()
        serializer = SpeechSerializer(snippets, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SpeechSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)

@csrf_exempt
def speech_detail(request, pk):
    """
    Retrieve, update or delete a speech.
    """
    try:
        speech = Speech.objects.get(pk=pk)
    except Speech.DoesNotExist:
        return HttpResponse(status=404)

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
