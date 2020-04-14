using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Procedure
    {
        public Procedure()
        {
            PatientProcedure = new HashSet<PatientProcedure>();
        }

        public int ProId { get; set; }
        public string ProCode { get; set; }
        public string ProName { get; set; }
        public string ProDescription { get; set; }

        public virtual ICollection<PatientProcedure> PatientProcedure { get; set; }
    }
}
