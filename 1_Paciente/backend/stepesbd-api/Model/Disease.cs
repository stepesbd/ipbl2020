using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Disease
    {
        public Disease()
        {
            Diagnosis = new HashSet<Diagnosis>();
        }

        public int DisId { get; set; }
        public string DisName { get; set; }
        public string DisCode { get; set; }

        public virtual ICollection<Diagnosis> Diagnosis { get; set; }
    }
}
