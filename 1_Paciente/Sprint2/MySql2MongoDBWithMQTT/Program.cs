using System;
using System.Text;
using Microsoft.EntityFrameworkCore;
using mysqlefcore;

namespace MySql2MongoDBWithMQTT
{
    class Program
    {
        static void Main(string[] args)
        {
            //InsertData();
            PrintData();
        }



private static void InsertData()
    {
      using(var context = new LibraryContext())
      {
        // Creates the database if not exists
        context.Database.EnsureCreated();

        // Adds some Patient
        context.patient.Add(new Patient
        {
            pat_sus_number = 123456,
            pat_blood_group = "O",
            pat_rh_factor = "-",
            pat_inclusion_date = new DateTime(),
            pat_status = 1,
            per_id = 1            
        });

        // Saves changes
        context.SaveChanges();
      }
    }

    private static void PrintData()
    {
      // Gets and prints all patients in database
      using (var context = new LibraryContext())
      {
        var patients = context.patient;
        foreach(var patient in patients)
        {
          var data = new StringBuilder();
          data.AppendLine($"RhFactor: {patient.pat_rh_factor}");
          data.AppendLine($"Status: {patient.pat_status}");
          data.AppendLine($"SUSNumber: {patient.pat_sus_number}");
          data.AppendLine($"ID: {patient.per_id}");
          Console.WriteLine(data.ToString());
        }
      }
    }


    }
}
