
//Comandos usados para conexão com banco de dados
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet tool install --global dotnet-aspnet-codegenerator

Gerar Context
dotnet ef dbcontext scaffold "Server=database-test.c0aryf8gxxoa.sa-east-1.rds.amazonaws.com;Database=stepes_bd;User=admin;Password=password;TreatTinyAsBoolean=true;" "Pomelo.EntityFrameworkCore.MySql"

Atualizar Context
dotnet ef dbcontext scaffold "Server=database-test.c0aryf8gxxoa.sa-east-1.rds.amazonaws.com;Database=stepes_bd;User=admin;Password=password;TreatTinyAsBoolean=true;" "Pomelo.EntityFrameworkCore.MySql" --force
