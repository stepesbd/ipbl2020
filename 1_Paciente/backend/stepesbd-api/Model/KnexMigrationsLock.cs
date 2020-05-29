using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class KnexMigrationsLock
    {
        public uint Index { get; set; }
        public int? IsLocked { get; set; }
    }
}
