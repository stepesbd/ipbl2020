using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class LogPhysicians
    {
        public int IdLog { get; set; }
        public string Operation { get; set; }
        public int IdPhysician { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
    }
}
