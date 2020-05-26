using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Diagnosis
    {
        public int DiaId { get; set; }
        public DateTime DiaDate { get; set; }
        public int DiaChronic { get; set; }
        public string DiaClosed { get; set; }
        public int DisId { get; set; }
        public int PatId { get; set; }

        public virtual Disease Dis { get; set; }
        public virtual Patient Pat { get; set; }
    }
}
