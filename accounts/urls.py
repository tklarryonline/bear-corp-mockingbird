from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^profile$', 'accounts.views.profile'),
    url(r'^profile/$', 'accounts.views.profile'),
    url(r'^profile/home/$', 'accounts.views.home'),
    url(r'^speeches', 'speeches.views.upload_file')
)
