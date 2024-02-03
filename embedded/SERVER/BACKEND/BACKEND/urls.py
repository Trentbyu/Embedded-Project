"""
URL configuration for BACKEND project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from rest_framework.routers import DefaultRouter
from settingsApp.views import PageSettingsViewSet
from settingsApp.views  import ElementListCreateView, ElementRetrieveUpdateDestroyView , create_element, ElementDeleteView, get_video
router = DefaultRouter()
router.register(r'page-settings', PageSettingsViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/elements/', ElementListCreateView.as_view(), name='element-list-create'),
    path('api/elements/<int:pk>/', ElementRetrieveUpdateDestroyView.as_view(), name='element-detail'),
    path('api/elements/create/', create_element, name='create-element'),
    path('api/elements/<int:pk>/delete/', ElementDeleteView.as_view(), name='element-delete'),
    path('api/get-video/', get_video, name='get_video'),
    path('api/', include(router.urls)),
]
