from django.shortcuts import render
from django.urls import reverse_lazy
from fornecedor.models import Fornecedor,Representante,Produto,Estoque
from django.views.generic.edit import UpdateView, CreateView, DeleteView
from django.views import generic

# Lista Fornecedor

class FornecedorListView(generic.ListView):
    model = Fornecedor
    template_name = 'fornecedor_listar.html'
    context_object_name = 'fornecedores'


class FornecedorUpdateView(UpdateView):
    model = Fornecedor
    template_name = 'fornecedor_editar.html'
    fields = '__all__'
    context_object_name = 'fornecedor'
    success_url = reverse_lazy('fornecedor:listar')


class FornecedorCreateView(CreateView):
    model = Fornecedor
    template_name = 'fornecedor_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar')


class FornecedorDeleteView(DeleteView):
    model = Fornecedor
    context_object_name = 'fornecedor'
    template_name = 'fornecedor_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar')

###########################################################################################
class RepresentanteListView(generic.ListView):
    model = Representante
    template_name = 'representante_listar.html'
    context_object_name = 'representantes'


class RepresentanteUpdateView(UpdateView):
    model = Representante
    template_name = 'representante_editar.html'
    fields = '__all__'
    context_object_name = 'representante'
    success_url = reverse_lazy('fornecedor:listar_representante')


class RepresentanteCreateView(CreateView):
    model = Representante
    template_name = 'representante_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_representante')


class RepresentanteDeleteView(DeleteView):
    model = Representante
    context_object_name = 'representante'
    template_name = 'representante_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar_representante')
###########################################################################################
class ProdutoListView(generic.ListView):
    model = Produto
    template_name = 'produto_listar.html'
    context_object_name = 'produtos'


class ProdutoUpdateView(UpdateView):
    model = Produto
    template_name = 'produto_editar.html'
    fields = '__all__'
    context_object_name = 'produto'
    success_url = reverse_lazy('fornecedor:listar_produto')


class ProdutoCreateView(CreateView):
    model = Produto
    template_name = 'produto_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_produto')


class ProdutoDeleteView(DeleteView):
    model = Produto
    context_object_name = 'produto'
    template_name = 'produto_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar_produto')
###########################################################################################
class EstoqueListView(generic.ListView):
    model = Estoque
    template_name = 'estoque_listar.html'
    context_object_name = 'estoques'


class EstoqueUpdateView(UpdateView):
    model = Estoque
    template_name = 'estoque_editar.html'
    fields = '__all__'
    context_object_name = 'estoque'
    success_url = reverse_lazy('fornecedor:listar_estoque')


class EstoqueCreateView(CreateView):
    model = Estoque
    template_name = 'estoque_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_estoque')


class EstoqueDeleteView(DeleteView):
    model = Estoque
    context_object_name = 'estoque'
    template_name = 'estoque_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar_estoque')
###########################################################################################