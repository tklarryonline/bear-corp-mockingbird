from django.conf.urls import patterns, include, url
from rest_framework import routers
from django.contrib import admin
from accounts.views import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles import views

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mockingbird.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
    url(r'^api/$', 'mockingbird_api.views.api_root'),
    # Account
    url(r'^accounts/', include('accounts.urls')),
    url(r'^users/$', UserList.as_view(), name='users-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='user-detail'),

    # Speeches
    url(r'^speeches/', include('speeches.urls')),
)

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += [
        url(r'^upload/(?P<path>.*)$', views.serve),
    ]

