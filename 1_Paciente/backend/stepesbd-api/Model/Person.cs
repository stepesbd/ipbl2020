using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Person
    {
        public Person()
        {
            Patient = new HashSet<Patient>();
        }

        public int PerId { get; set; }
        public string PerFirstName { get; set; }
        public string PerLastName { get; set; }
        public DateTime PerBirth { get; set; }
        public string PerEmail { get; set; }
        public string PerCpf { get; set; }
        public string PerSenha { get; set; }
        public int? AddId { get; set; }

        public virtual Address Add { get; set; }
        public virtual ICollection<Patient> Patient { get; set; }
    }
}
