using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Physicians
    {
        public Physicians()
        {
            Addresses = new HashSet<Addresses>();
            Contacts = new HashSet<Contacts>();
            PhysicianSpecialties = new HashSet<PhysicianSpecialties>();
        }

        public uint Id { get; set; }
        public string Name { get; set; }
        public string Crm { get; set; }
        public string Cpf { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<Addresses> Addresses { get; set; }
        public virtual ICollection<Contacts> Contacts { get; set; }
        public virtual ICollection<PhysicianSpecialties> PhysicianSpecialties { get; set; }
    }
}
