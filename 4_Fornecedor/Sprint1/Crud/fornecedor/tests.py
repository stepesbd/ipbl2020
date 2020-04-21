from django.test import TestCase
from fornecedor.models import Fornecedor
from fornecedor.models import Representante
from fornecedor.models import Estoque
from django.test import Client

class FornecedorModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
        self.fornecedor = Fornecedor.objects.create(cnpj=10000010108, razao_social='Hospital',endereco='av',contato=975555221)

    # teste de nome de atributo
    def test_cnpj_label(self):
        fornecedor = Fornecedor.objects.get(id=1)
        field_label = fornecedor._meta.get_field('cnpj').verbose_name
        self.assertEquals(field_label, 'cnpj')

    def test_razao_social_label(self):
        fornecedor = Fornecedor.objects.get(id=1)
        field_label = fornecedor._meta.get_field('razao_social').verbose_name
        self.assertEquals(field_label, 'razao social')

    def test_endereco_label(self):
        fornecedor = Fornecedor.objects.get(id=1)
        field_label = fornecedor._meta.get_field('endereco').verbose_name
        self.assertEquals(field_label, 'endereco')

    def test_contato_label(self):
        fornecedor = Fornecedor.objects.get(id=1)
        field_label = fornecedor._meta.get_field('contato').verbose_name
        self.assertEquals(field_label, 'contato')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_cnpj(self):
        obj = Fornecedor.objects.get(id=1)
        field_value = obj.cnpj
        self.assertEquals(len(str(field_value)), 11)

    def test_contato(self):
        obj = Fornecedor.objects.get(id=1)
        field_value = obj.contato
        self.assertEquals(len(str(field_value)), 9)

    def test_razao_social(self):
        obj = Fornecedor.objects.get(id=1)
        field_value = obj.razao_social
        self.assertEquals(field_value, 'Hospital')

    def test_endereco(self):
        obj = Fornecedor.objects.get(id=1)
        field_value = obj.endereco
        self.assertEquals(field_value, 'av')

class RepresentanteModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
         obj = Fornecedor.objects.get(id=1)
         self.representante = Representante.objects.create(cpf=10120230304, nome='Representante 1', contato='1112345678',
                                                    fornecedor=obj.razao_social)
    # teste de nome de atributo
    def test_cpf_label(self):
        representante = Representante.objects.get(id=1)
        field_label = representante._meta.get_field('cpf').verbose_name
        self.assertEquals(field_label, 'cpf')

    def test_nome_label(self):
        representante = Representante.objects.get(id=1)
        field_label = representante._meta.get_field('nome').verbose_name
        self.assertEquals(field_label, 'nome')

    def test_contato_label(self):
        representante = Representante.objects.get(id=1)
        field_label = representante._meta.get_field('contato').verbose_name
        self.assertEquals(field_label, 'contato')

    def test_fornecedor_label(self):
        representante = Representante.objects.get(id=1)
        field_label = representante._meta.get_field('fornecedor').verbose_name
        self.assertEquals(field_label, 'fornecedor')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_cpf(self):
        obj = Representante.objects.get(id=1)
        field_value = obj.cpf
        self.assertEquals(len(str(field_value)), 11)

    def test_nome(self):
        obj = Representante.objects.get(id=1)
        field_value = obj.nome
        self.assertEquals(field_value, 'Representante 1')

    def test_contato(self):
        obj = Representante.objects.get(id=1)
        field_value = obj.contato
        self.assertEquals(field_value, '1112345678')

    def test_fornecedor(self):
        obj = Representante.objects.get(id=1)
        field_value = obj.fornecedor
        self.assertEquals(field_value, 'Hospital')

class EstoqueModelTest(TestCase):
    # setup dos dados de teste para classe Estoque
    @classmethod
    def setUpTestData(self):
    	self.estoque = Estoque.objects.create(descricao='mascara', quantidade=100)
    # teste de nome de atributo
    def test_descricao_label(self):
        estoque = Estoque.objects.get(id=1)
        field_label = estoque._meta.get_field('descricao').verbose_name
        self.assertEquals(field_label, 'descricao')

    def test_quantidade_label(self):
        estoque = Estoque.objects.get(id=1)
        field_label = estoque._meta.get_field('quantidade').verbose_name
        self.assertEquals(field_label, 'quantidade')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_descricao(self):
        obj = Estoque.objects.get(id=1)
        field_value = obj.descricao
        self.assertEqual(field_value, 'mascara')

    def test_quantidade(self):
        obj = Estoque.objects.get(id=1)
        field_value = obj.quantidade
        self.assertEqual(len(str(field_value)), 999999)

class ProdutoModelTest(TestCase):
    #configurando os dados para o teste da classe produtos
    @classmethod
    def setUpTestData(self):
        obj = Fornecedor.objects.get(id=1)
        self.produto = Produto.objects.create(descricao='DescProduto', fornecedor=obj.razao_social)
    #teste de nome de atributo
    def test_descr_label(self):
        produto = Produto.objects.get(id=1)
        field_label = produto._meta.get_field('descr').verbose_name
        self.assertEquals(field_label, 'descr')
    def test_fornecedor_label(self):
        produto = Produto.objects.get(id=1)
        field_label = produto._meta.get_field('fornecedor').verbose_name
        self.assertEquals(field_label, 'fornecedor')
    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)
    #Teste de valores
    def test_descr(self):
        obj = Produto.objects.get(id=1)
        field_value = obj.descricao
        self.assertEquals(field_value, 'DescProduto')
    def test_fornecedor(self):
        obj = Produto.objects.get(id=1)
        field_value = obj.fornecedor
        self.assertEquals(field_value, '')
