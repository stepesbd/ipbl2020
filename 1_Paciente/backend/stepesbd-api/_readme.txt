
//Comandos usados para conexão com banco de dados
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet tool install --global dotnet-aspnet-codegenerator
dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson

Gerar Context
dotnet ef dbcontext scaffold "Server=stepesbd.ddns.net;Database=stepes_bd;User=root;Password=stepesbd2020;Port=6603;TreatTinyAsBoolean=true;" "Pomelo.EntityFrameworkCore.MySql"

Atualizar Context
dotnet ef dbcontext scaffold "Server=stepesbd.ddns.net;Database=stepes_bd;User=root;Password=stepesbd2020;Port=6603;TreatTinyAsBoolean=true;" "Pomelo.EntityFrameworkCore.MySql" --force

Buildar scaffold
--verbose