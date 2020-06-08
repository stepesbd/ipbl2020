using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class PhysicianSpecialties
    {
        public uint Id { get; set; }
        public uint PhysicianId { get; set; }
        public uint SpecialtiesId { get; set; }

        public virtual Physicians Physician { get; set; }
        public virtual Specialties Specialties { get; set; }
    }
}
