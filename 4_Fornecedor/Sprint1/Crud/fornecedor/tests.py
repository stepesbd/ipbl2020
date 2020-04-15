from django.test import TestCase
from fornecedor.models import Fornecedor
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

