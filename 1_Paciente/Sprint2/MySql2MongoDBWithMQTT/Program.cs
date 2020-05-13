using System;
using System.Text;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using mysqlefcore;

namespace MySql2MongoDBWithMQTT
{
    class Program
    {
      
        static void Main(string[] args)
        {
            //Mysql
            //InsertData();
            //PrintData();

            //MongoDB          

            //Creating MongoDB Client Object
            var client = new MongoClient("mongodb+srv://stepesbd:stepesbd@stepesbd-8e6rc.mongodb.net/test?retryWrites=true&w=majority");
            
            // Listing in console all databases on MongoDB Server 
            // var dbList = client.ListDatabases().ToList();
            // Console.WriteLine("The list of databases on this server is: ");
            // foreach (var db in dbList)
            // {
            //     Console.WriteLine(db);
            // }

            // Selecting STEPESBD database
            IMongoDatabase database = client.GetDatabase("STEPESBD");        

            // Selecting ATENDIMENTOS Collection on STEPESBD database
            IMongoCollection<AttendanceMongo> colAttendance = database.GetCollection<AttendanceMongo>("ATENDIMENTOS");

            // Write on console actual estimated documents count on ATENDIMENTOS Collection
            //Console.WriteLine("Count> " + (colAttendance.EstimatedDocumentCount().ToString()));

            // Creating new Attendance Object to insert on ATENDIMENTOS Collection
            AttendanceMongo newAttendance = new AttendanceMongo();
            newAttendance.Name = "TESTE";
            newAttendance.LastName = "TESTE";
            newAttendance.Active = true;

            // Inserting Attendance Object to ATENDIMENTOS Collection
            //colAttendance.InsertOne(newAttendance);
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
