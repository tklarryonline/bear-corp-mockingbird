from django.shortcuts import render_to_response
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from accounts.serializers import UserSerializer, GroupSerializer

def profile(request):
    return render_to_response('accounts/profile.html');

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
