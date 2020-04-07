"""stepesbd URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
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
from stepesbd.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    # Incluindo as urls do fornecedor.urls e colocando no fornecedor/.
    path('fornecedor/', include('fornecedor.urls', namespace='fornecedor')),
    #path('representante/', include('representante.urls', namespace='representante')),
    #path('produto/', include('produto.urls', namespace='produto')),
    #path('estoque/', include('estoque.urls', namespace='estoque')),
    path('', index, name='index')
]
