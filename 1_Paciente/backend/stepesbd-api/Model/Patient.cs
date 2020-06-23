using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Patient
    {
        public Patient()
        {
            Diagnosis = new HashSet<Diagnosis>();
        }

        public int PatId { get; set; }
        public int? PatSusNumber { get; set; }
        public string PatBloodGroup { get; set; }
        public string PatRhFactor { get; set; }
        public DateTime PatInclusionDate { get; set; }
        public int PatStatus { get; set; }
        public int? PerId { get; set; }

        public virtual Person Per { get; set; }
        public virtual ICollection<Diagnosis> Diagnosis { get; set; }
    }
}
