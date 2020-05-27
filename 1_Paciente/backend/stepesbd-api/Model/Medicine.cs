using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Medicine
    {
        public Medicine()
        {
            Revenue = new HashSet<Revenue>();
        }

        public int MedId { get; set; }
        public string MedCode { get; set; }
        public string MedNome { get; set; }

        public virtual ICollection<Revenue> Revenue { get; set; }
    }
}
