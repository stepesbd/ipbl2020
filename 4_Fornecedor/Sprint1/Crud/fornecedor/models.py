from django.db import models
from django.core.validators import MaxValueValidator

class Provider(models.Model):
    PRO_ID = models.AutoField(primary_key=True)
    PRO_CNPJ = models.IntegerField('Cnpj',validators=[MaxValueValidator(99999999999)],unique=True,null=False)
    PRO_SOCIAL_REASON = models.CharField('Razão social',max_length=45,null=False)
    PRO_ADRESS = models.CharField('Endereço',max_length=45,null=False)
    PRO_CONTACT = models.IntegerField('Contato',validators=[MaxValueValidator(99999999999)],null=False)

    # Função responsavel por pela label do objeto numa lista
    def __str__(self):
        return self.PRO_SOCIAL_REASON

class Representative(models.Model):

    REP_ID = models.AutoField(primary_key=True)
    REP_CPF = models.CharField('Cpf',max_length=15,unique=True)
    REP_NAME = models.CharField('Nome',max_length=45,null=False)
    REP_CONTACT = models.IntegerField('Telefone Fixo',validators=[MaxValueValidator(99999999999)],null=False)
    REP_CONTACT_CEL = models.IntegerField('Celular', validators=[MaxValueValidator(99999999999)],null=True)
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
    PRD_DESCRIPTION = models.CharField('Descrição',max_length=45)
    PRD_PROVIDER = models.ForeignKey(Provider,verbose_name='Fornecedor',on_delete=models.CASCADE)
    #PRD_IMAGE = models.ImageField(upload_to='imagens/', null=True, blank=True)
    def __str__(self):
        return self.PRD_DESCRIPTION

class Stock(models.Model):
    SEXO_CHOICES = (
        ("E", "Entrada"),
        ("S", "Saída")
    )
    STK_ID =  models.AutoField(primary_key=True)
    STK_TYPE =  models.CharField(verbose_name='Tipo',max_length=1,choices=SEXO_CHOICES, blank=False, null=False)
    STK_PRODUCT = models.ForeignKey(Product, verbose_name='Produto',on_delete=models.CASCADE)
    STK_QUANTITY = models.IntegerField('Quantidade',null=False)


    def __str__(self):
        return self.STK_PRODUCT


