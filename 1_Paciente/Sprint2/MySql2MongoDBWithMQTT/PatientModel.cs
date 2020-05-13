using System;
using System.Collections.Generic;

namespace mysqlefcore
{
  public class Patient
  {
    public int pat_id { get; set; }
    public int pat_sus_number { get; set; }
    public string pat_blood_group { get; set; }
    public string pat_rh_factor { get; set; }   
    public DateTime pat_inclusion_date { get; set; }
    public int pat_status { get; set; }
    public int per_id { get; set; }
  }
}