using System;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;

namespace testeSend2MqttDotNetCore
{
    class Program
    {
        static ConnectionFactory factory;
        static void Main(string[] args)
        {
            // RabbitMQ 
            //Connection
            factory = new ConnectionFactory()
            {
                HostName = "stepesbd.ddns.net",
                Port = 5672,
                UserName = "guest",
                Password = "stepesbd2020"
            };

            string queue2ack = "ts_01_ack_queue";

            Thread thread = new Thread(() => startsubscriber(queue2ack));
            thread.Start();


            Console.WriteLine("Enviando insert...");
            atendimentoInsert insert = new atendimentoInsert(queue2ack, "joao");
            sendcommand(JsonSerializer.Serialize(insert));
            Thread.Sleep(5000);
        }

        private static void startsubscriber(string queue_resposta)
        {
            //Subscriber
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: queue_resposta,
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += Consumer_Received;
                channel.BasicConsume(queue: queue_resposta,
                     autoAck: true,
                     consumer: consumer);
            }
        }
        private static void Consumer_Received(object sender, BasicDeliverEventArgs e)
        {
            var body = e.Body.Span;
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine("Reposta:"+message);
        }

        private static void sendcommand(string message)
        {
            //Publlisher
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "mqtt2mongo",
                                      durable: false,
                                      exclusive: false,
                                      autoDelete: false,
                                      arguments: null);

                var body = Encoding.UTF8.GetBytes(message);
                Console.WriteLine("Enviando mensagem");
                channel.BasicPublish(exchange: "",
                                      routingKey: "mqtt2mongo",
                                      basicProperties: null,
                                      body: body);
            }
        }
    }
}
