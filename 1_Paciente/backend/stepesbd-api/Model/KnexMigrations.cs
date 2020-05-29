using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class KnexMigrations
    {
        public uint Id { get; set; }
        public string Name { get; set; }
        public int? Batch { get; set; }
        public DateTime? MigrationTime { get; set; }
    }
}
