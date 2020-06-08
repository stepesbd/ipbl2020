using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class Address
    {
        public Address()
        {
            Person = new HashSet<Person>();
        }

        public int AddId { get; set; }
        public string AddStreet { get; set; }
        public string AddNumber { get; set; }
        public string AddExtraNumber { get; set; }
        public string AddCity { get; set; }
        public string AddState { get; set; }
        public string AddNeighborhood { get; set; }
        public string AddCountry { get; set; }
        public string AddZipcode { get; set; }

        public virtual ICollection<Person> Person { get; set; }
    }
}
