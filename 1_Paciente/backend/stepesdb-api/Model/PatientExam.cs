using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class PatientExam
    {
        public int PaeId { get; set; }
        public DateTime PaeDate { get; set; }
        public string PaeLaboratory { get; set; }
        public string PaeResult { get; set; }
        public int PatId { get; set; }
        public int ExaId { get; set; }

        public virtual Exam Exa { get; set; }
        public virtual Patient Pat { get; set; }
    }
}
