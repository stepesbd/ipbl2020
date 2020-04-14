using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class PatientProcedure
    {
        public int PapId { get; set; }
        public DateTime PapDate { get; set; }
        public int PapEmergency { get; set; }
        public string PapHospital { get; set; }
        public int PatId { get; set; }
        public int ProId { get; set; }

        public virtual Patient Pat { get; set; }
        public virtual Procedure Pro { get; set; }
    }
}
