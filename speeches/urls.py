from django.conf.urls import patterns, url
from .views import SpeechesList, SpeechDetail, submit, submit_silent

urlpatterns = patterns('',
    url(r'^$', SpeechesList.as_view(), name='speeches-list'),
    url(r'^submit/$', submit),
    url(r'^submit-silent/$', submit_silent),
    url(r'^(?P<pk>[0-9]+)/$', SpeechDetail.as_view()),
)
