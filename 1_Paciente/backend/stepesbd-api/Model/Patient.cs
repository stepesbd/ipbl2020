using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Patient
    {
        public Patient()
        {
            Attendance = new HashSet<Attendance>();
            Diagnosis = new HashSet<Diagnosis>();
            EventMedicalRecord = new HashSet<EventMedicalRecord>();
            PatientExam = new HashSet<PatientExam>();
            PatientProcedure = new HashSet<PatientProcedure>();
            Revenue = new HashSet<Revenue>();
        }

        public int PatId { get; set; }
        public int? PatSusNumber { get; set; }
        public string PatBloodGroup { get; set; }
        public string PatRhFactor { get; set; }
        public DateTime PatInclusionDate { get; set; }
        public int PerId { get; set; }

        public virtual Person Per { get; set; }
        public virtual ICollection<Attendance> Attendance { get; set; }
        public virtual ICollection<Diagnosis> Diagnosis { get; set; }
        public virtual ICollection<EventMedicalRecord> EventMedicalRecord { get; set; }
        public virtual ICollection<PatientExam> PatientExam { get; set; }
        public virtual ICollection<PatientProcedure> PatientProcedure { get; set; }
        public virtual ICollection<Revenue> Revenue { get; set; }
    }
}
