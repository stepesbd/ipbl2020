from django.test import TestCase
from fornecedor.models import Provider
from fornecedor.models import Representative
from fornecedor.models import Stock
from fornecedor.models import Product
from django.test import Client


class ProviderModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
        self.fornecedor = Provider.objects.create(PRO_ID=1,PRO_CNPJ=10000010108, PRO_SOCIAL_REASON='Hospital', PRO_ADRESS='av',
                                                    PRO_CONTACT=975555221)

    # teste de nome de atributo
    def test_cnpj_label(self):
        provider = Provider.objects.get(PRO_ID=1)
        field_label = provider._meta.get_field('PRO_CNPJ').verbose_name
        self.assertEquals(field_label, 'Cnpj')

    def test_razao_social_label(self):
        provider = Provider.objects.get(PRO_ID=1)
        field_label = provider._meta.get_field('PRO_SOCIAL_REASON').verbose_name
        self.assertEquals(field_label, 'Razão social')

    def test_endereco_label(self):
        provider = Provider.objects.get(PRO_ID=1)
        field_label = provider._meta.get_field('PRO_ADRESS').verbose_name
        self.assertEquals(field_label, 'Endereço')

    def test_contato_label(self):
        provider = Provider.objects.get(PRO_ID=1)
        field_label = provider._meta.get_field('PRO_CONTACT').verbose_name
        self.assertEquals(field_label, 'Contato')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_cnpj(self):
        obj = Provider.objects.get(PRO_ID=1)
        field_value = obj.PRO_CNPJ
        self.assertEquals(len(str(field_value)), 11)

    def test_contato(self):
        obj = Provider.objects.get(PRO_ID=1)
        field_value = obj.PRO_CONTACT
        self.assertEquals(len(str(field_value)), 9)

    def test_razao_social(self):
        obj = Provider.objects.get(PRO_ID=1)
        field_value = obj.PRO_SOCIAL_REASON
        self.assertEquals(field_value, 'Hospital')

    def test_endereco(self):
        obj = Provider.objects.get(PRO_ID=1)
        field_value = obj.PRO_ADRESS
        self.assertEquals(field_value, 'av')


class RepresentativeModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
        obj = Provider.objects.create(PRO_ID=1,PRO_CNPJ=10000010108, PRO_SOCIAL_REASON='Hospital', PRO_ADRESS='av',
                                                    PRO_CONTACT=975555221)
        self.representante = Representative.objects.create(REP_ID=1,REP_CPF=10120230304, REP_NAME='Representante 1',
                                                           REP_CONTACT='1112345678',REP_CONTACT_CEL=10212121,
                                                           REP_CONTACT_EMAIL='teste@gmail.com',
                                                           REP_PROVIDER=obj)


    # teste de nome de atributo
    def test_cpf_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_CPF').verbose_name
        self.assertEquals(field_label, 'Cpf')

    def test_nome_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_NAME').verbose_name
        self.assertEquals(field_label, 'Nome')

    def test_contato_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_CONTACT').verbose_name
        self.assertEquals(field_label, 'Telefone Fixo')

    def test_fornecedor_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_PROVIDER').verbose_name
        self.assertEquals(field_label, 'Fornecedor')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_cpf(self):
        obj = Representative.objects.get(REP_ID=1)
        field_value = obj.REP_CPF
        self.assertEquals(len(str(field_value)), 11)

    def test_nome(self):
        obj = Representative.objects.get(REP_ID=1)
        field_value = obj.REP_NAME
        self.assertEquals(field_value, 'Representante 1')

    def test_contato(self):
        obj = Representative.objects.get(REP_ID=1)
        field_value = obj.REP_CONTACT
        self.assertEquals(field_value, 1112345678)

    def test_fornecedor(self):
        obj = Representative.objects.get(REP_ID=1)
        field_value = obj.REP_PROVIDER
        self.assertEquals(str(field_value), 'Hospital')

class ProductModelTest(TestCase):
    # configurando os dados para o teste da classe produtos
    @classmethod
    def setUpTestData(self):
       obj = Provider.objects.create(PRO_ID=1, PRO_CNPJ=10000010108, PRO_SOCIAL_REASON='Hospital', PRO_ADRESS='av',
                                      PRO_CONTACT=975555221)
        self.produto = Product.objects.create(PRD_ID=1,PRD_NAME='DescProduto', PRD_DESCRIPTION='descricao',
                                              PRD_PROVIDER=obj)

    # teste de nome de atributo
    def test_descr_label(self):
        produto = Product.objects.get(PRD_ID=1)
        field_label = produto._meta.get_field('PRD_DESCRIPTION').verbose_name
        self.assertEquals(field_label, 'Descrição')

    def test_fornecedor_label(self):
        produto = Product.objects.get(PRD_ID=1)
        field_label = produto._meta.get_field('PRD_PROVIDER').verbose_name
        self.assertEquals(field_label, 'Fornecedor')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_descr(self):
        obj = Product.objects.get(PRD_ID=1)
        field_value = obj.PRD_DESCRIPTION
        self.assertEquals(field_value, 'descricao')

    def test_fornecedor(self):
        obj = Product.objects.get(PRD_ID=1)
        field_value = obj.PRD_PROVIDER
        self.assertEquals(str(field_value), 'Hospital')

class StockModelTest(TestCase):
    # setup dos dados de teste para classe Estoque
    @classmethod
    def setUpTestData(self):
        obj = Provider.objects.create(PRO_ID=1, PRO_CNPJ=10000010108, PRO_SOCIAL_REASON='Hospital', PRO_ADRESS='av',
                                      PRO_CONTACT=975555221)
        obj2 = Product.objects.create(PRD_ID=1, PRD_NAME='DescProduto', PRD_DESCRIPTION='descricao',
                                              PRD_PROVIDER=obj)

        self.estoque = Stock.objects.create(STK_ID=1,STK_TYPE='E', STK_PRODUCT=obj2,STK_QUANTITY=100)

    # teste de nome de atributo
    def test_descricao_label(self):
        estoque = Stock.objects.get(STK_ID=1)
        field_label = estoque._meta.get_field('STK_TYPE').verbose_name
        self.assertEquals(field_label, 'Tipo')

    def test_quantidade_label(self):
        estoque = Stock.objects.get(STK_ID=1)
        field_label = estoque._meta.get_field('STK_QUANTITY').verbose_name
        self.assertEquals(field_label, 'Quantidade')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_descricao(self):
        obj = Stock.objects.get(STK_ID=1)
        field_value = obj.STK_PRODUCT
        self.assertEqual(str(field_value), 'descricao')

    def test_quantidade(self):
        obj = Stock.objects.get(STK_ID=1)
        field_value = obj.STK_QUANTITY
        self.assertEqual(int(field_value), 100)