'''class RepresentanteModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
        obj = Representative.objects.get(id=1)
        self.representante = Representative.objects.create(cpf=10120230304, nome='Representante 1', contato='1112345678',
                                                          fornecedor=obj.razao_social)

    # teste de nome de atributo
    def test_cpf_label(self):
        representante = Representative.objects.get(id=1)
        field_label = representante._meta.get_field('cpf').verbose_name
        self.assertEquals(field_label, 'cpf')

    def test_nome_label(self):
        representante = Representative.objects.get(id=1)
        field_label = representante._meta.get_field('nome').verbose_name
        self.assertEquals(field_label, 'nome')

    def test_contato_label(self):
        representante = Representative.objects.get(id=1)
        field_label = representante._meta.get_field('contato').verbose_name
        self.assertEquals(field_label, 'contato')

    def test_fornecedor_label(self):
        representante = Representative.objects.get(id=1)
        field_label = representante._meta.get_field('fornecedor').verbose_name
        self.assertEquals(field_label, 'fornecedor')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_cpf(self):
        obj = Representative.objects.get(id=1)
        field_value = obj.cpf
        self.assertEquals(len(str(field_value)), 11)

    def test_nome(self):
        obj = Representative.objects.get(id=1)
        field_value = obj.nome
        self.assertEquals(field_value, 'Representante 1')

    def test_contato(self):
        obj = Representative.objects.get(id=1)
        field_value = obj.contato
        self.assertEquals(field_value, '1112345678')

    def test_fornecedor(self):
        obj = Representative.objects.get(id=1)
        field_value = obj.fornecedor
        self.assertEquals(field_value, 'Hospital')


class EstoqueModelTest(TestCase):
    # setup dos dados de teste para classe Estoque
    @classmethod
    def setUpTestData(self):
        self.estoque = Stock.objects.create(descricao='mascara', quantidade=100)

    # teste de nome de atributo
    def test_descricao_label(self):
        estoque = Stock.objects.get(id=1)
        field_label = estoque._meta.get_field('descricao').verbose_name
        self.assertEquals(field_label, 'descricao')

    def test_quantidade_label(self):
        estoque = Stock.objects.get(id=1)
        field_label = estoque._meta.get_field('quantidade').verbose_name
        self.assertEquals(field_label, 'quantidade')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_descricao(self):
        obj = Stock.objects.get(id=1)
        field_value = obj.descricao
        self.assertEqual(field_value, 'mascara')

    def test_quantidade(self):
        obj = Stock.objects.get(id=1)
        field_value = obj.quantidade
        self.assertEqual(len(str(field_value)), 999999)


class ProdutoModelTest(TestCase):
    # configurando os dados para o teste da classe produtos
    @classmethod
    def setUpTestData(self):
        obj = Product.objects.get(id=1)
        self.produto = Product.objects.create(descricao='DescProduto', fornecedor=obj.razao_social)

    # teste de nome de atributo
    def test_descr_label(self):
        produto = Product.objects.get(id=1)
        field_label = produto._meta.get_field('descr').verbose_name
        self.assertEquals(field_label, 'descr')

    def test_fornecedor_label(self):
        produto = Product.objects.get(id=1)
        field_label = produto._meta.get_field('fornecedor').verbose_name
        self.assertEquals(field_label, 'fornecedor')

    # Teste de rota
    def test_get(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    # Teste de valores
    def test_descr(self):
        obj = Product.objects.get(id=1)
        field_value = obj.descricao
        self.assertEquals(field_value, 'DescProduto')

    def test_fornecedor(self):
        obj = Product.objects.get(id=1)
        field_value = obj.fornecedor
        self.assertEquals(field_value, '')'''



class RepresentativeModelTest(TestCase):
    # setup dos dados de teste para classe Fornecedor
    @classmethod
    def setUpTestData(self):
        obj = Provider.objects.get()
        self.representante = Representative.objects.create(REP_ID=1,REP_CPF=10120230304, REP_NAME='Representante 1',
                                                           REP_CONTACT='1112345678',REP_CONTACT_CEL=10212121,
                                                           REP_CONTACT_EMAIL='teste@gmail.com',
                                                           REP_PROVIDER=obj.PRO_SOCIAL_REASON)

    # teste de nome de atributo
    def test_cpf_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_CPF').verbose_name
        self.assertEquals(field_label, 'cpf')

    def test_nome_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_NAME').verbose_name
        self.assertEquals(field_label, 'nome')

    def test_contato_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_CONTACT').verbose_name
        self.assertEquals(field_label, 'contato')

    def test_fornecedor_label(self):
        representante = Representative.objects.get(REP_ID=1)
        field_label = representante._meta.get_field('REP_PROVIDER').verbose_name
        self.assertEquals(field_label, 'fornecedor')

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
        self.assertEquals(field_value, '1112345678')

    def test_fornecedor(self):
        obj = Representative.objects.get(REP_ID=1)
        field_value = obj.REP_PROVIDER
        self.assertEquals(field_value, 'Hospital')




class StockModelTest(TestCase):
    # setup dos dados de teste para classe Estoque
    @classmethod
    def setUpTestData(self):
        self.estoque = Stock.objects.create(STK_ID=1,STK_TYPE='E', STK_PRODUCT='produto',STK_QUANTITY=100)

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
        self.assertEqual(field_value, 'mascara')

    def test_quantidade(self):
        obj = Stock.objects.get(STK_ID=1)
        field_value = obj.quantidade
        self.assertEqual(len(str(field_value)), 999999)