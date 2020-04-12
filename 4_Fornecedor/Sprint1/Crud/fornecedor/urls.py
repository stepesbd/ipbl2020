from django.urls import path

from . import views

app_name = 'fornecedor'
urlpatterns = [
    path('listar/', views.FornecedorListView.as_view(), name='listar'),
    path('criar/', views.FornecedorCreateView.as_view(), name='criar'),
    path('<int:pk>/editar', views.FornecedorUpdateView.as_view(), name='editar'),
    path('<int:pk>/deletar', views.FornecedorDeleteView.as_view(), name='deletar'),

    path('listar_representante/', views.RepresentanteListView.as_view(), name='listar_representante'),
    path('criar_representante/', views.RepresentanteCreateView.as_view(), name='criar_representante'),
    path('<int:pk>/editar_representante', views.RepresentanteUpdateView.as_view(), name='editar_representante'),
    path('<int:pk>/deletar_representante', views.RepresentanteDeleteView.as_view(), name='deletar_representante'),

    path('listar_produto/', views.ProdutoListView.as_view(), name='listar_produto'),
    path('criar_produto/', views.ProdutoCreateView.as_view(), name='criar_produto'),
    path('<int:pk>/editar_produto', views.ProdutoUpdateView.as_view(), name='editar_produto'),
    path('<int:pk>/deletar_produto', views.ProdutoDeleteView.as_view(), name='deletar_produto'),

    path('listar_estoque/', views.EstoqueListView.as_view(), name='listar_estoque'),
    path('criar_estoque/', views.EstoqueCreateView.as_view(), name='criar_estoque'),
    path('<int:pk>/editar_estoque', views.EstoqueUpdateView.as_view(), name='editar_estoque'),
    path('<int:pk>/deletar_estoque', views.EstoqueDeleteView.as_view(), name='deletar_estoque'),
]
