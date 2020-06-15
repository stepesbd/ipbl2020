from django.db import models
from django.core.validators import MaxValueValidator
from fornecedor.helper_functions import *


class Provider(models.Model):
    PRO_ID = models.AutoField(primary_key=True)
    PRO_CNPJ = models.CharField('Cnpj',unique=True, max_length=14, validators=[validate_CNPJ])
    PRO_SOCIAL_REASON = models.CharField('Razão social',max_length=45,null=False)
    PRO_ADRESS = models.CharField('Endereço',max_length=45,null=False)
    PRO_CONTACT = models.DecimalField('Contato',null=False,max_digits=11, decimal_places=0)

    # Função responsavel por pela label do objeto numa lista
    def __str__(self):
        return self.PRO_SOCIAL_REASON

class Representative(models.Model):
    REP_ID = models.AutoField(primary_key=True)
    REP_CPF = models.CharField('Cpf',unique=True, max_length=14, validators=[validate_CPF])
    REP_NAME = models.CharField('Nome',max_length=45,null=False)
    REP_CONTACT = models.DecimalField('Telefone Fixo',null=False,max_digits=10, decimal_places=0)
    REP_CONTACT_CEL = models.DecimalField('Celular',null=False,max_digits=11, decimal_places=0)
    REP_CONTACT_EMAIL = models.CharField('Email', max_length=45,null=True)
    REP_PROVIDER = models.ForeignKey(Provider,verbose_name='Fornecedor', on_delete=models.CASCADE)

    def __str__(self):
        return self.REP_NAME

class Contact(models.Model):
    CON_ID = models.AutoField(primary_key=True)
    CON_CONTACT_TYPE = models.CharField(max_length=45,null=False)
    CON_CONTACT_DESCRIPTION = models.CharField(max_length=45,null=False)
    CON_CPF_REPRESENTATIVE = models.ForeignKey(Representative, on_delete=models.CASCADE)

class Product(models.Model):
    PRD_ID = models.AutoField(primary_key=True)
    PRD_NAME = models.CharField('Nome do produto',max_length=45,null=False)
    PRD_DESCRIPTION = models.CharField('Descrição',max_length=45,null=False)
    PRD_PROVIDER = models.ForeignKey(Provider,verbose_name='Fornecedor',on_delete=models.CASCADE)
    #PRD_IMAGE = models.ImageField(upload_to='imagens/', null=True, blank=True)
    def __str__(self):
        return self.PRD_DESCRIPTION

class Stock(models.Model):
    STK_ID =  models.AutoField(primary_key=True)
    STK_TYPE =  models.CharField(verbose_name='Tipo',max_length=45,blank=False, null=False)
    STK_PRODUCT = models.ForeignKey(Product, verbose_name='Produto',on_delete=models.CASCADE)
    STK_QUANTITY = models.PositiveIntegerField('Quantidade',null=False)

    def __str__(self):
        return self.STK_PRODUCT

class Order(models.Model):
    ord_id = models.AutoField(primary_key=True)
    ord_asset_id = models.CharField(max_length=255)
    ord_date = models.DateField(blank=True, null=True)
    ord_quantity = models.IntegerField()
    ord_status = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Order'
        app_label = 'hospital'





