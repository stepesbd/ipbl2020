using System;
using System.Text;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using mysqlefcore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MySql2MongoDBWithMQTT
{
    class Program
    {

        static void Main(string[] args)
        {
            //Mysql
            // Insert Data on MySQl database, Patient Table
            InsertData();
            // Print all Data on MySQl database, Patient Table
            PrintData();

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
            colAttendance.InsertOne(newAttendance);



            // RabbitMQ 
            //Connection
            var factory = new ConnectionFactory()
            {
                HostName = "127.0.0.1",
                Port = 5672,
                UserName = "guest",
                Password = "guest"
            };

            //Subscriber
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "ATENDIMENTOS",
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += Consumer_Received;
                channel.BasicConsume(queue: "ATENDIMENTOS",
                     autoAck: true,
                     consumer: consumer);

                Console.WriteLine("Aguardando mensagens para processamento");
                //Console.WriteLine("Pressione uma tecla para continuar...");
                Console.Read();
            }

            //Publlisher
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "ATENDIMENTOS",
                                      durable: false,
                                      exclusive: false,
                                      autoDelete: false,
                                      arguments: null);

                string message =
                    $"{DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")} - " +
                    $"Conteúdo da Mensagem: {"teste3"}";
                var body = Encoding.UTF8.GetBytes(message);
                Console.WriteLine("Enviando mensagem");
                channel.BasicPublish(exchange: "",
                                      routingKey: "TestesASPNETCore",
                                      basicProperties: null,
                                      body: body);
            }

        }

        private static void Consumer_Received(
                    object sender, BasicDeliverEventArgs e)
        {
            var body = e.Body.Span;
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine(Environment.NewLine +
                "[Nova mensagem recebida] " + message);
        }


        private static void InsertData()
        {
            using (var context = new PatientContext())
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
            using (var context = new PatientContext())
            {
                foreach (var patient in context.patient)
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
