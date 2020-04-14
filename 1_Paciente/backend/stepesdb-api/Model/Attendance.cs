using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Attendance
    {
        public int AttId { get; set; }
        public DateTime AttDate { get; set; }
        public int AttEmergency { get; set; }
        public string AttDoctor { get; set; }
        public string AttLocation { get; set; }
        public int PatId { get; set; }

        public virtual Patient Pat { get; set; }
    }
}
