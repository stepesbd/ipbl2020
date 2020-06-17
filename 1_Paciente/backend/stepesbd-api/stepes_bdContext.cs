using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace stepesdb_api
{
    public partial class stepes_bdContext : DbContext
    {
        public stepes_bdContext()
        {
        }

        public stepes_bdContext(DbContextOptions<stepes_bdContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Address> Address { get; set; }
        public virtual DbSet<Addresses> Addresses { get; set; }
        public virtual DbSet<Attendance> Attendance { get; set; }
        public virtual DbSet<Contacts> Contacts { get; set; }
        public virtual DbSet<Diagnosis> Diagnosis { get; set; }
        public virtual DbSet<Disease> Disease { get; set; }
        public virtual DbSet<EventMedicalRecord> EventMedicalRecord { get; set; }
        public virtual DbSet<KnexMigrations> KnexMigrations { get; set; }
        public virtual DbSet<KnexMigrationsLock> KnexMigrationsLock { get; set; }
        public virtual DbSet<Patient> Patient { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<PhysicianSpecialties> PhysicianSpecialties { get; set; }
        public virtual DbSet<Physicians> Physicians { get; set; }
        public virtual DbSet<Specialties> Specialties { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("server=stepesbd.ddns.net;database=stepes_bd;user=root;password=stepesbd2020;port=6603;treattinyasboolean=true", x => x.ServerVersion("8.0.20-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(e => e.AddId)
                    .HasName("PRIMARY");

                entity.ToTable("address");

                entity.Property(e => e.AddId).HasColumnName("add_id");

                entity.Property(e => e.AddCity)
                    .IsRequired()
                    .HasColumnName("add_city")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddCountry)
                    .IsRequired()
                    .HasColumnName("add_country")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddExtraNumber)
                    .HasColumnName("add_extra_number")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddNeighborhood)
                    .IsRequired()
                    .HasColumnName("add_neighborhood")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddNumber)
                    .HasColumnName("add_number")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddState)
                    .IsRequired()
                    .HasColumnName("add_state")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddStreet)
                    .IsRequired()
                    .HasColumnName("add_street")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AddZipcode)
                    .IsRequired()
                    .HasColumnName("add_zipcode")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
                    
                entity.Property(e => e.AddLatitude)
                    .IsRequired()
                    .HasColumnName("add_latitude")
                    .HasColumnType("varchar(30)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
                    
                entity.Property(e => e.AddLongitude)
                    .IsRequired()
                    .HasColumnName("add_longitude")
                    .HasColumnType("varchar(30)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<Addresses>(entity =>
            {
                entity.ToTable("addresses");

                entity.HasIndex(e => e.PhysicianId)
                    .HasName("addresses_physicianid_foreign");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasColumnName("city")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.District)
                    .IsRequired()
                    .HasColumnName("district")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PhysicianId).HasColumnName("physicianId");

                entity.Property(e => e.State)
                    .IsRequired()
                    .HasColumnName("state")
                    .HasColumnType("varchar(2)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Street)
                    .IsRequired()
                    .HasColumnName("street")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Zipcode)
                    .IsRequired()
                    .HasColumnName("zipcode")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.HasOne(d => d.Physician)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.PhysicianId)
                    .HasConstraintName("addresses_physicianid_foreign");
            });

            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.AttId)
                    .HasName("PRIMARY");

                entity.ToTable("attendance");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_att_pat_idx");

                entity.Property(e => e.AttId).HasColumnName("att_id");

                entity.Property(e => e.AttDate)
                    .HasColumnName("att_date")
                    .HasColumnType("date");

                entity.Property(e => e.AttDoctor)
                    .IsRequired()
                    .HasColumnName("att_doctor")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'Dr. Adilson Marques da Cunha'")
                    .HasComment("Doctor Name")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.AttEmergency)
                    .HasColumnName("att_emergency")
                    .HasComment("Boolean Value. 0-Routine 1-Emergency");

                entity.Property(e => e.AttLocation)
                    .IsRequired()
                    .HasColumnName("att_location")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'ITA HOSPITAL'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId).HasColumnName("pat_id");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.Attendance)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_att_pat");
            });

            modelBuilder.Entity<Contacts>(entity =>
            {
                entity.ToTable("contacts");

                entity.HasIndex(e => e.PhysicianId)
                    .HasName("contacts_physicianid_foreign");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Contact)
                    .IsRequired()
                    .HasColumnName("contact")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PhysicianId).HasColumnName("physicianId");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.HasOne(d => d.Physician)
                    .WithMany(p => p.Contacts)
                    .HasForeignKey(d => d.PhysicianId)
                    .HasConstraintName("contacts_physicianid_foreign");
            });

            modelBuilder.Entity<Diagnosis>(entity =>
            {
                entity.HasKey(e => e.DiaId)
                    .HasName("PRIMARY");

                entity.ToTable("diagnosis");

                entity.HasIndex(e => e.DisId)
                    .HasName("fk_dia_dis_idx");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_dia_pat_idx");

                entity.Property(e => e.DiaId).HasColumnName("dia_id");

                entity.Property(e => e.DiaChronic).HasColumnName("dia_chronic");

                entity.Property(e => e.DiaClosed)
                    .IsRequired()
                    .HasColumnName("dia_closed")
                    .HasColumnType("varchar(1)")
                    .HasDefaultValueSql("'0'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.DiaDate)
                    .HasColumnName("dia_date")
                    .HasColumnType("date");

                entity.Property(e => e.DisId).HasColumnName("dis_id");

                entity.Property(e => e.PatId).HasColumnName("pat_id");

                entity.HasOne(d => d.Dis)
                    .WithMany(p => p.Diagnosis)
                    .HasForeignKey(d => d.DisId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_dia_dis");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.Diagnosis)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_dia_pat");
            });

            modelBuilder.Entity<Disease>(entity =>
            {
                entity.HasKey(e => e.DisId)
                    .HasName("PRIMARY");

                entity.ToTable("disease");

                entity.Property(e => e.DisId).HasColumnName("dis_id");

                entity.Property(e => e.DisCode)
                    .IsRequired()
                    .HasColumnName("dis_code")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.DisName)
                    .IsRequired()
                    .HasColumnName("dis_name")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<EventMedicalRecord>(entity =>
            {
                entity.HasKey(e => e.EmrId)
                    .HasName("PRIMARY");

                entity.ToTable("event_medical_record");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_emr_pat_idx");

                entity.Property(e => e.EmrId).HasColumnName("emr_id");

                entity.Property(e => e.EmrDate)
                    .HasColumnName("emr_date")
                    .HasColumnType("date")
                    .HasComment("Event Date");

                entity.Property(e => e.EmrDescription)
                    .IsRequired()
                    .HasColumnName("emr_description")
                    .HasColumnType("mediumtext")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.EmrReferenceId)
                    .HasColumnName("emr_reference_id")
                    .HasComment("Value of Primary Key in Target Entity");

                entity.Property(e => e.EmrType)
                    .IsRequired()
                    .HasColumnName("emr_type")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'GENERIC EVENT'")
                    .HasComment("GENERIC EVENT | ATTENDANCE | EXAM | PROCEDURE | REVENUE | DIAGNOSIS | BIRTH | DEATH")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId).HasColumnName("pat_id");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.EventMedicalRecord)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_emr_pat");
            });

            modelBuilder.Entity<KnexMigrations>(entity =>
            {
                entity.ToTable("knex_migrations");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Batch).HasColumnName("batch");

                entity.Property(e => e.MigrationTime)
                    .HasColumnName("migration_time")
                    .HasColumnType("timestamp");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<KnexMigrationsLock>(entity =>
            {
                entity.HasKey(e => e.Index)
                    .HasName("PRIMARY");

                entity.ToTable("knex_migrations_lock");

                entity.Property(e => e.Index).HasColumnName("index");

                entity.Property(e => e.IsLocked).HasColumnName("is_locked");
            });

            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasKey(e => e.PatId)
                    .HasName("PRIMARY");

                entity.ToTable("patient");

                entity.HasIndex(e => e.PerId)
                    .HasName("fk_pat_per_idx");

                entity.Property(e => e.PatId).HasColumnName("pat_id");

                entity.Property(e => e.PatBloodGroup)
                    .HasColumnName("pat_blood_group")
                    .HasColumnType("varchar(2)")
                    .HasComment("A, AB, B, O")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatInclusionDate)
                    .HasColumnName("pat_inclusion_date")
                    .HasColumnType("date");

                entity.Property(e => e.PatRhFactor)
                    .HasColumnName("pat_rh_factor")
                    .HasColumnType("varchar(1)")
                    .HasComment("+, -")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatStatus)
                    .HasColumnName("pat_status")
                    .HasDefaultValueSql("'1'")
                    .HasComment("1. ativo (default) 2. falecido 3. exclusão por erro operacional");

                entity.Property(e => e.PatSusNumber).HasColumnName("pat_sus_number");

                entity.Property(e => e.PerId).HasColumnName("per_id");

                entity.HasOne(d => d.Per)
                    .WithMany(p => p.Patient)
                    .HasForeignKey(d => d.PerId)
                    .HasConstraintName("fk_pat_per");
            });

            modelBuilder.Entity<Person>(entity =>
            {
                entity.HasKey(e => e.PerId)
                    .HasName("PRIMARY");

                entity.ToTable("person");

                entity.HasIndex(e => e.AddId)
                    .HasName("fk_per_add_idx");

                entity.HasIndex(e => e.PerCpf)
                    .HasName("per_cpf_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.PerId).HasColumnName("per_id");

                entity.Property(e => e.AddId).HasColumnName("add_id");

                entity.Property(e => e.PerBirth)
                    .HasColumnName("per_birth")
                    .HasColumnType("date");

                entity.Property(e => e.PerCpf).HasColumnName("per_cpf");

                entity.Property(e => e.PerEmail)
                    .HasColumnName("per_email")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
                
                entity.Property(e => e.PerSenha).HasColumnName("per_senha");

                entity.Property(e => e.PerFirstName)
                    .IsRequired()
                    .HasColumnName("per_first_name")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PerLastName)
                    .IsRequired()
                    .HasColumnName("per_last_name")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.HasOne(d => d.Add)
                    .WithMany(p => p.Person)
                    .HasForeignKey(d => d.AddId)
                    .HasConstraintName("fk_per_add");
            });

            modelBuilder.Entity<PhysicianSpecialties>(entity =>
            {
                entity.ToTable("physician_specialties");

                entity.HasIndex(e => e.PhysicianId)
                    .HasName("physician_specialties_physicianid_foreign");

                entity.HasIndex(e => e.SpecialtiesId)
                    .HasName("physician_specialties_specialtiesid_foreign");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.PhysicianId).HasColumnName("physicianId");

                entity.Property(e => e.SpecialtiesId).HasColumnName("specialtiesId");

                entity.HasOne(d => d.Physician)
                    .WithMany(p => p.PhysicianSpecialties)
                    .HasForeignKey(d => d.PhysicianId)
                    .HasConstraintName("physician_specialties_physicianid_foreign");

                entity.HasOne(d => d.Specialties)
                    .WithMany(p => p.PhysicianSpecialties)
                    .HasForeignKey(d => d.SpecialtiesId)
                    .HasConstraintName("physician_specialties_specialtiesid_foreign");
            });

            modelBuilder.Entity<Physicians>(entity =>
            {
                entity.ToTable("physicians");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Cpf)
                    .IsRequired()
                    .HasColumnName("cpf")
                    .HasColumnType("varchar(11)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Crm)
                    .IsRequired()
                    .HasColumnName("crm")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasDefaultValueSql("'1'");
            });

            modelBuilder.Entity<Specialties>(entity =>
            {
                entity.ToTable("specialties");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasDefaultValueSql("'1'");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
