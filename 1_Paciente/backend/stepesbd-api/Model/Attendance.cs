using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Attendance
    {
        public int AttId { get; set; }
        public DateTime? AttDate { get; set; }
        public string AttPreSymptoms { get; set; }
        public string AttDescription { get; set; }
        public int? HosId { get; set; }
        public int? MedId { get; set; }
        public int? PerId { get; set; }

        public virtual Person Per { get; set; }
    }
}
