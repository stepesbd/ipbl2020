using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Contacts
    {
        public uint Id { get; set; }
        public uint PhysicianId { get; set; }
        public string Type { get; set; }
        public string Contact { get; set; }

        public virtual Physicians Physician { get; set; }
    }
}
