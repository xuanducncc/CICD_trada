"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from backend.views import backend404
from django.conf import settings
from django.conf.urls.static import static
#handler404 = backend404

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.apps.authentication.urls')),
    path('api/', include('backend.apps.cms.urls')),
    path('api/', include('backend.apps.editor.urls')),
    path('api/', include('backend.apps.annotator.urls')),
    path('api/', include('backend.apps.uploader.urls')),
    path('api/', include('backend.apps.logger.urls')),
    path('api/', include('backend.apps.exporter.urls')),
    path('api/', include('backend.apps.validator.urls')),
    path('api/oauth/', include('rest_framework_social_oauth2.urls')),
    path('swagger/', include('backend.apps.swagger.urls')),    
    #path('', include('backend.apps.core.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
