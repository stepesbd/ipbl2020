using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class DeathPersons
    {
        public string PerFirstName { get; set; }
        public string PerLastName { get; set; }
        public DateTime? PatDeathDate { get; set; }
        public string CausaMortis { get; set; }
        public string PatDeathCertificate { get; set; }
    }
}
