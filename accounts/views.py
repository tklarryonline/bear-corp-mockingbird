from django.shortcuts import render_to_response
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser

def profile(request):
    return render_to_response('accounts/profile.html');

class FileUploadView(APIView):
    parser_classes = (FileUploadParser,)

    def put(self, request, filename, format=None):
        file_obj = request.FILES['file']
        # ...
        # do some staff with uploaded file
        # ...
        return Response(status=204)
