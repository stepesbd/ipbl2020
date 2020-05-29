using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Addresses
    {
        public uint Id { get; set; }
        public uint PhysicianId { get; set; }
        public string Type { get; set; }
        public string Zipcode { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Street { get; set; }
        public string Status { get; set; }

        public virtual Physicians Physician { get; set; }
    }
}
