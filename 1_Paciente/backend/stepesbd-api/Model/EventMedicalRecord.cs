using System;
using System.Collections.Generic;

namespace stepesdb_api
{
    public partial class EventMedicalRecord
    {
        public int EmrId { get; set; }
        public DateTime EmrDate { get; set; }
        public string EmrType { get; set; }
        public string EmrDescription { get; set; }
        public int? EmrReferenceId { get; set; }
        public int PatId { get; set; }

        public virtual Patient Pat { get; set; }
    }
}
