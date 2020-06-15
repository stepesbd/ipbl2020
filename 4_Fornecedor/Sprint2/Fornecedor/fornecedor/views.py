from django.urls import reverse_lazy
from fornecedor.models import Provider,Representative,Product,Stock, Order
from django.views.generic.edit import UpdateView, CreateView, DeleteView, View
from django.views import generic
from django.db.models import F
from django.shortcuts import render_to_response

# Lista Provider

class ProviderListView(generic.ListView):
    model = Provider
    template_name = 'fornecedor_listar.html'
    context_object_name = 'fornecedores'
    paginate_by = 5


class ProviderUpdateView(UpdateView):
    model = Provider
    template_name = 'fornecedor_editar.html'
    fields = '__all__'
    context_object_name = 'fornecedor'
    success_url = reverse_lazy('fornecedor:listar')


class ProviderCreateView(CreateView):
    model = Provider
    template_name = 'fornecedor_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar')


class ProviderDeleteView(DeleteView):
    model = Provider
    context_object_name = 'fornecedor'
    template_name = 'fornecedor_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar')

###########################################################################################
class RepresentativeListView(generic.ListView):
    model = Representative
    template_name = 'representante_listar.html'
    context_object_name = 'representantes'
    paginate_by = 5


class RepresentativeUpdateView(UpdateView):
    model = Representative
    template_name = 'representante_editar.html'
    fields = '__all__'
    context_object_name = 'representante'
    success_url = reverse_lazy('fornecedor:listar_representante')


class RepresentativeCreateView(CreateView):
    model = Representative
    template_name = 'representante_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_representante')


class RepresentativeDeleteView(DeleteView):
    model = Representative
    context_object_name = 'representante'
    template_name = 'representante_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar_representante')
###########################################################################################
class ProductListView(generic.ListView):
    model = Product
    template_name = 'produto_listar.html'
    context_object_name = 'produtos'
    paginate_by = 5


class ProductUpdateView(UpdateView):
    model = Product
    template_name = 'produto_editar.html'
    fields = '__all__'
    context_object_name = 'produto'
    success_url = reverse_lazy('fornecedor:listar_produto')


class ProductCreateView(CreateView):
    model = Product
    template_name = 'produto_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_produto')


class ProductDeleteView(DeleteView):
    model = Product
    context_object_name = 'produto'
    template_name = 'produto_confirmacao_deletar.html'
    success_url = reverse_lazy('fornecedor:listar_produto')
###########################################################################################
class StockListView(generic.ListView):
    model = Stock
    template_name = 'estoque_listar.html'
    context_object_name = 'estoques'
    paginate_by = 5

class StockCreateView(CreateView):
    model = Stock
    template_name = 'estoque_criar.html'
    fields = '__all__'
    success_url = reverse_lazy('fornecedor:listar_estoque')

class StockUpdateView(UpdateView):
    model = Stock
    template_name = 'estoque_editar.html'
    fields = '__all__'
    context_object_name = 'estoque'
    success_url = reverse_lazy('fornecedor:listar_estoque')
    paginate_by = 5
 ###########################################################################################

class OrderListView(generic.ListView):
    model = Order
    template_name = 'pedido.html'
    context_object_name = 'pedidos'
    paginate_by = 5

class OrderUpdateView(UpdateView):
    model = Stock
    template_name = 'venda.html'
    fields = '__all__'
    context_object_name = 'pedidos'
    success_url = reverse_lazy('fornecedor:venda')
    paginate_by = 5

class SellListView(generic.ListView):
    model = Order
    template_name = 'venda.html'
    context_object_name = 'vendas'
    paginate_by = 5


#def RequestListView(request):
#   return render_to_response('pedido.html')

#def SellListView(request):
#   return render_to_response('venda.html')
