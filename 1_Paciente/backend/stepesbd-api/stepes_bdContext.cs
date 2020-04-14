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

        public stepes_bdContext(DbContextOptions<stepes_bdContext> options) : base(options)
        {
        }

        public virtual DbSet<Address> Address { get; set; }
        public virtual DbSet<Attendance> Attendance { get; set; }
        public virtual DbSet<Diagnosis> Diagnosis { get; set; }
        public virtual DbSet<Disease> Disease { get; set; }
        public virtual DbSet<EventMedicalRecord> EventMedicalRecord { get; set; }
        public virtual DbSet<Exam> Exam { get; set; }
        public virtual DbSet<Medicine> Medicine { get; set; }
        public virtual DbSet<Patient> Patient { get; set; }
        public virtual DbSet<PatientExam> PatientExam { get; set; }
        public virtual DbSet<PatientProcedure> PatientProcedure { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<Procedure> Procedure { get; set; }
        public virtual DbSet<Revenue> Revenue { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("server=database-test.c0aryf8gxxoa.sa-east-1.rds.amazonaws.com;database=stepes_bd;user=admin;password=password;treattinyasboolean=true", x => x.ServerVersion("8.0.17-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(e => e.AddId)
                    .HasName("PRIMARY");

                entity.ToTable("address");

                entity.Property(e => e.AddId)
                    .HasColumnName("add_id")
                    .HasColumnType("int(11)");

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

                entity.Property(e => e.Addresscol)
                    .IsRequired()
                    .HasColumnName("addresscol")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.AttId)
                    .HasName("PRIMARY");

                entity.ToTable("attendance");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_att_pat_idx");

                entity.Property(e => e.AttId)
                    .HasColumnName("att_id")
                    .HasColumnType("int(11)");

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
                    .HasColumnType("int(11)")
                    .HasComment("Boolean Value. 0-Routine 1-Emergency");

                entity.Property(e => e.AttLocation)
                    .IsRequired()
                    .HasColumnName("att_location")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'ITA HOSPITAL'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.Attendance)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_att_pat");
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

                entity.Property(e => e.DiaId)
                    .HasColumnName("dia_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.DiaChronic)
                    .HasColumnName("dia_chronic")
                    .HasColumnType("int(11)");

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

                entity.Property(e => e.DisId)
                    .HasColumnName("dis_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

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

                entity.Property(e => e.DisId)
                    .HasColumnName("dis_id")
                    .HasColumnType("int(11)");

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

                entity.Property(e => e.EmrId)
                    .HasColumnName("emr_id")
                    .HasColumnType("int(11)");

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
                    .HasColumnType("int(11)")
                    .HasComment("Value of Primary Key in Target Entity");

                entity.Property(e => e.EmrType)
                    .IsRequired()
                    .HasColumnName("emr_type")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'GENERIC EVENT'")
                    .HasComment("GENERIC EVENT | ATTENDANCE | EXAM | PROCEDURE | REVENUE | DIAGNOSIS | BIRTH | DEATH")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.EventMedicalRecord)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_emr_pat");
            });

            modelBuilder.Entity<Exam>(entity =>
            {
                entity.HasKey(e => e.ExaId)
                    .HasName("PRIMARY");

                entity.ToTable("exam");

                entity.Property(e => e.ExaId)
                    .HasColumnName("exa_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ExaCode)
                    .IsRequired()
                    .HasColumnName("exa_code")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.ExaDescription)
                    .HasColumnName("exa_description")
                    .HasColumnType("varchar(200)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.ExaName)
                    .IsRequired()
                    .HasColumnName("exa_name")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<Medicine>(entity =>
            {
                entity.HasKey(e => e.MedId)
                    .HasName("PRIMARY");

                entity.ToTable("medicine");

                entity.Property(e => e.MedId)
                    .HasColumnName("med_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.MedCode)
                    .IsRequired()
                    .HasColumnName("med_code")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.MedNome)
                    .IsRequired()
                    .HasColumnName("med_nome")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasKey(e => e.PatId)
                    .HasName("PRIMARY");

                entity.ToTable("patient");

                entity.HasIndex(e => e.PerId)
                    .HasName("fk_pat_per_idx");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

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

                entity.Property(e => e.PatSusNumber)
                    .HasColumnName("pat_sus_number")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PerId)
                    .HasColumnName("per_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Per)
                    .WithMany(p => p.Patient)
                    .HasForeignKey(d => d.PerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_pat_per");
            });

            modelBuilder.Entity<PatientExam>(entity =>
            {
                entity.HasKey(e => e.PaeId)
                    .HasName("PRIMARY");

                entity.ToTable("patient_exam");

                entity.HasIndex(e => e.ExaId)
                    .HasName("fk_pae_exa_idx");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_pae_pat_idx");

                entity.Property(e => e.PaeId)
                    .HasColumnName("pae_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ExaId)
                    .HasColumnName("exa_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PaeDate)
                    .HasColumnName("pae_date")
                    .HasColumnType("date");

                entity.Property(e => e.PaeLaboratory)
                    .IsRequired()
                    .HasColumnName("pae_laboratory")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'ITA LABORATORY'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PaeResult)
                    .IsRequired()
                    .HasColumnName("pae_result")
                    .HasColumnType("varchar(500)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Exa)
                    .WithMany(p => p.PatientExam)
                    .HasForeignKey(d => d.ExaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_pae_exa");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.PatientExam)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_pae_pat");
            });

            modelBuilder.Entity<PatientProcedure>(entity =>
            {
                entity.HasKey(e => e.PapId)
                    .HasName("PRIMARY");

                entity.ToTable("patient_procedure");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_pap_pat_idx");

                entity.HasIndex(e => e.ProId)
                    .HasName("fk_pap_pro_idx");

                entity.Property(e => e.PapId)
                    .HasColumnName("pap_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PapDate)
                    .HasColumnName("pap_date")
                    .HasColumnType("date");

                entity.Property(e => e.PapEmergency)
                    .HasColumnName("pap_emergency")
                    .HasColumnType("int(11)")
                    .HasComment("0-Routine 1-Emergency");

                entity.Property(e => e.PapHospital)
                    .IsRequired()
                    .HasColumnName("pap_hospital")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'ITA HOSPITAL'")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ProId)
                    .HasColumnName("pro_id")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.PatientProcedure)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_pap_pat");

                entity.HasOne(d => d.Pro)
                    .WithMany(p => p.PatientProcedure)
                    .HasForeignKey(d => d.ProId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_pap_pro");
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

                entity.Property(e => e.PerId)
                    .HasColumnName("per_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.AddId)
                    .HasColumnName("add_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PerBirth)
                    .HasColumnName("per_birth")
                    .HasColumnType("date");

                entity.Property(e => e.PerCpf)
                    .HasColumnName("per_cpf")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PerEmail)
                    .HasColumnName("per_email")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

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

            modelBuilder.Entity<Procedure>(entity =>
            {
                entity.HasKey(e => e.ProId)
                    .HasName("PRIMARY");

                entity.ToTable("procedure");

                entity.Property(e => e.ProId)
                    .HasColumnName("pro_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ProCode)
                    .IsRequired()
                    .HasColumnName("pro_code")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.ProDescription)
                    .HasColumnName("pro_description")
                    .HasColumnType("varchar(200)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.ProName)
                    .IsRequired()
                    .HasColumnName("pro_name")
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");
            });

            modelBuilder.Entity<Revenue>(entity =>
            {
                entity.HasKey(e => e.RevId)
                    .HasName("PRIMARY");

                entity.ToTable("revenue");

                entity.HasIndex(e => e.MedId)
                    .HasName("fk_rev_med_idx");

                entity.HasIndex(e => e.PatId)
                    .HasName("fk_rev_pat_idx");

                entity.Property(e => e.RevId)
                    .HasColumnName("rev_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.MedId)
                    .HasColumnName("med_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.PatId)
                    .HasColumnName("pat_id")
                    .HasColumnType("int(11)");

                entity.Property(e => e.RevDosage)
                    .IsRequired()
                    .HasColumnName("rev_dosage")
                    .HasColumnType("varchar(10)")
                    .HasComment("5ml, 10 drops...")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.Property(e => e.RevFrequencyByDay)
                    .HasColumnName("rev_frequency_by_day")
                    .HasColumnType("int(11)")
                    .HasComment("Take the medice x times per day.");

                entity.Property(e => e.RevLimitDate)
                    .HasColumnName("rev_limit_date")
                    .HasColumnType("date")
                    .HasComment("Take the medicine until .......");

                entity.Property(e => e.RevPrescriptionCode)
                    .IsRequired()
                    .HasColumnName("rev_prescription_code")
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_general_ci");

                entity.HasOne(d => d.Med)
                    .WithMany(p => p.Revenue)
                    .HasForeignKey(d => d.MedId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_rev_med");

                entity.HasOne(d => d.Pat)
                    .WithMany(p => p.Revenue)
                    .HasForeignKey(d => d.PatId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_rev_pat");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
