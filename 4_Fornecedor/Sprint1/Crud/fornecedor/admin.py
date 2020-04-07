from django.contrib import admin
from fornecedor.models import Fornecedor

# Pedindo pro django admin conseguir "cuidar" do model de Cliente
# No django admin se consegue listrar, criar, excluir e editar um Cliente
admin.site.register(Fornecedor)
