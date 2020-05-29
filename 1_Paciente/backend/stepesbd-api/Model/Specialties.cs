using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Specialties
    {
        public Specialties()
        {
            PhysicianSpecialties = new HashSet<PhysicianSpecialties>();
        }

        public uint Id { get; set; }
        public string Name { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<PhysicianSpecialties> PhysicianSpecialties { get; set; }
    }
}
