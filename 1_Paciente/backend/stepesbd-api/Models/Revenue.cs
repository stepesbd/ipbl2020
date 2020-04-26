using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Revenue
    {
        public int RevId { get; set; }
        public string RevPrescriptionCode { get; set; }
        public DateTime RevLimitDate { get; set; }
        public int RevFrequencyByDay { get; set; }
        public string RevDosage { get; set; }
        public int MedId { get; set; }
        public int PatId { get; set; }

        public virtual Medicine Med { get; set; }
        public virtual Patient Pat { get; set; }
    }
}
