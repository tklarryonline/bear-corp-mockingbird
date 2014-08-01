from django.conf.urls import patterns, url
from .views import SpeechesList, SpeechDetail, dummy

urlpatterns = patterns('',
    url(r'^dummy$', dummy),
    url(r'^$', SpeechesList.as_view(), name='speeches-list'),
    url(r'^(?P<pk>[0-9]+)/$', SpeechDetail.as_view()),
)
