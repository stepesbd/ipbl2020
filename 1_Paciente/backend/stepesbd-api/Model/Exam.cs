using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Exam
    {
        public Exam()
        {
            PatientExam = new HashSet<PatientExam>();
        }

        public int ExaId { get; set; }
        public string ExaName { get; set; }
        public string ExaCode { get; set; }
        public string ExaDescription { get; set; }

        public virtual ICollection<PatientExam> PatientExam { get; set; }
    }
}
