from django.urls import path

from . import views

app_name = 'fornecedor'
urlpatterns = [
    path('listar/', views.ProviderListView.as_view(), name='listar'),
    path('criar/', views.ProviderCreateView.as_view(), name='criar'),
    path('<int:pk>/editar', views.ProviderUpdateView.as_view(), name='editar'),
    path('<int:pk>/deletar', views.ProviderDeleteView.as_view(), name='deletar'),

    path('listar_representante/', views.RepresentativeListView.as_view(), name='listar_representante'),
    path('criar_representante/', views.RepresentativeCreateView.as_view(), name='criar_representante'),
    path('<int:pk>/editar_representante', views.RepresentativeUpdateView.as_view(), name='editar_representante'),
    path('<int:pk>/deletar_representante', views.RepresentativeDeleteView.as_view(), name='deletar_representante'),

    path('listar_produto/', views.ProductListView.as_view(), name='listar_produto'),
    path('criar_produto/', views.ProductCreateView.as_view(), name='criar_produto'),
    path('<int:pk>/editar_produto', views.ProductUpdateView.as_view(), name='editar_produto'),
    path('<int:pk>/deletar_produto', views.ProductDeleteView.as_view(), name='deletar_produto'),

    path('listar_estoque/', views.StockListView.as_view(), name='listar_estoque'),
    path('criar_estoque/', views.StockCreateView.as_view(), name='criar_estoque'),
    path('<int:pk>/editar_estoque', views.StockUpdateView.as_view(), name='editar_estoque'),

]
