from django.conf.urls import patterns, include, url
from rest_framework import routers
from django.contrib import admin
from mockingbird_api import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

admin.autodiscover()

urlpatterns = patterns('mockingbird',
    # Examples:
    # url(r'^$', 'mockingbird.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
    url(r'^', include(router.urls)),

    # Account
    url(r'^accounts/', include('accounts.urls'))
)

urlpatterns += staticfiles_urlpatterns()

