from django.urls import reverse_lazy
from fornecedor.models import Provider,Representative,Product,Stock
from django.views.generic.edit import UpdateView, CreateView, DeleteView, View
from django.views import generic
from django.db.models import F

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
    #queryset = Stock.objects.filter(STK_PRODUCT="John Smith").update(STK_QUANTITY=F("STK_QUANTITY") + 10)
    success_url = reverse_lazy('fornecedor:listar_estoque')

###########################################################################################



