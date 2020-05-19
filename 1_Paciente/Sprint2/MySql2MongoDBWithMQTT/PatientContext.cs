using Microsoft.EntityFrameworkCore;
//using MySQL.Data.EntityFrameworkCore.Extensions;

namespace mysqlefcore
{
  public class PatientContext : DbContext
  {
    public DbSet<Patient> patient { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      optionsBuilder.UseMySQL("server=database-test.c0aryf8gxxoa.sa-east-1.rds.amazonaws.com;database=stepes_bd;user=admin;password=password");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<Patient>(entity =>
      {
        entity.HasKey(e => e.pat_id);
        entity.Property(e => e.per_id).IsRequired();
      });
    }
  }
}