from django.conf.urls import patterns, url
from .views import SpeechesList, SpeechDetail

urlpatterns = patterns('',
    url(r'^$', SpeechesList.as_view(), name='speeches-list'),
    url(r'^(?P<pk>[0-9]+)/$', SpeechDetail.as_view()),
)
