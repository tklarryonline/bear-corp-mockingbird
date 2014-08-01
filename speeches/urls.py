from django.conf.urls import patterns, url

urlpatterns = patterns('speeches.views',
    url(r'^$', 'speeches_list'),
    url(r'^(?P<pk>[0-9]+)/$', 'speech_detail'),
)
