using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using RabbitMQ.Client;
using System.Threading;
using System.Windows.Forms.DataVisualization.Charting;
using System.IO.Ports;

namespace rabbitMQPerformaceTest
{
    public partial class Form1 : Form
    {
        IConnection conn;
        string queue = "performaceTeste";
        Dictionary<int, DateTime> dicionarioTeste;
        Dictionary<int, TimeSpan> dicionarioResultado;
        string data2send = " teste de performance";

        public Form1()
        {
            InitializeComponent();
            CheckForIllegalCrossThreadCalls = false;
            inicializaGrafico();
        }

        public void inicializaGrafico()
        {
            Resultado.Series.Clear();
            var series = new Series("Resultado");

            Resultado.ChartAreas["ChartArea1"].AxisX.Title = "Mensagem";
            Resultado.ChartAreas["ChartArea1"].AxisY.Title = "Resposta (ms)";


            series.BorderWidth = 3;
            series.ChartType = SeriesChartType.Spline;

            // Frist parameter is X-Axis and Second is Collection of Y- Axis
            //series.Points.DataBindXY(new[] { 2001, 2002, 2003, 2004 }, new[] { 100, 200, 90, 150 });
            Resultado.Series.Add(series);
        }

        private void button4_Click(object sender, EventArgs e)
        {
            configureRabbitMQConnection();
        }

        public void configureRabbitMQConnection()
        {
            try
            {
                button4.Enabled = false;
                ConnectionFactory factory = new ConnectionFactory();
                factory.UserName = tbuser.Text;
                factory.Password = tbPass.Text;
                factory.HostName = tbServer.Text;
                factory.Port = Protocols.DefaultProtocol.DefaultPort;

                //ConnectionFactory factory = new ConnectionFactory();
                //factory.Uri = new Uri("amqp://" + tbuser.Text + ":" + tbPass.Text + "@" + tbServer.Text + ":5672/");

                conn = factory.CreateConnection();

                tbuser.Enabled = false;
                tbPass.Enabled = false;
                tbServer.Enabled = false;

                button3.Enabled = true;
                textBox2.Enabled = true;

            }
            catch (Exception ex)
            {
                button4.Enabled = true;
                MessageBox.Show(ex.Message);
            }

        }

        public QueueDeclareOk CreateQueue(string queueName, IConnection connection)
        {
            QueueDeclareOk queue;
            using (var channel = connection.CreateModel())
            {
                queue = channel.QueueDeclare(queueName, false, false, true, null);
            }
            return queue;
        }

        public bool WriteMessageOnQueue(string message, string queueName, IConnection connection)
        {
            using (var channel = connection.CreateModel())
            {
                channel.BasicPublish(string.Empty, queueName, null, Encoding.ASCII.GetBytes(message));
            }

            return true;
        }


        public string RetrieveSingleMessage(string queueName, IConnection connection)
        {
            BasicGetResult data;
            using (var channel = connection.CreateModel())
            {
                data = channel.BasicGet(queueName, true);
            }
            return data != null ? System.Text.Encoding.UTF8.GetString(data.Body.ToArray()) : null;
        }

        public void subscriber(string queueName, IConnection connection)
        {
            while (true)
            {
                string data = RetrieveSingleMessage(queueName, connection);
                if (data != null)
                {
                    try
                    {
                        int id = Convert.ToInt32(data.Split(' ')[0]);
                        TimeSpan dif = DateTime.Now.Subtract(dicionarioTeste[id]);
                        dicionarioResultado.Add(id, dif);
                        textBox1.AppendText("teste : " + id.ToString() + " | Diferença de tempo: " + dif.ToString("ss':'fff") + Environment.NewLine);
                        Resultado.Series.First().Points.AddXY(id, dif.TotalMilliseconds);
                        if (id == dicionarioTeste.Count)
                            finalizarTeste();
                    }
                    catch (Exception)
                    {

                    }
                }
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                inicializaGrafico();
                textBox1.Clear();
                button1.Enabled = false;
                button1.Text = "Testando...";


                label4.Text = "Mensagens perdidas:";
                label5.Text = "Média de tempo:";

                dicionarioResultado = new Dictionary<int, TimeSpan>();
                dicionarioTeste = new Dictionary<int, DateTime>();

                for (int i = 1; i < Convert.ToInt32(msgQt.Text) + 1; i++)
                {
                    dicionarioTeste.Add(i, DateTime.Now);
                    WriteMessageOnQueue(i.ToString() + data2send, queue, conn);
                    Thread.Sleep(Convert.ToInt32(msgSleep.Text));
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                throw;
            }



        }

        private void finalizarTeste()
        {
            int perdidas = 0;
            TimeSpan media = new TimeSpan();

            foreach (var item in dicionarioTeste)
            {
                if (!dicionarioResultado.ContainsKey(item.Key))
                    perdidas++;
            }

            foreach (var item in dicionarioResultado)
            {
                media += item.Value;
            }

            media = TimeSpan.FromMilliseconds(media.TotalMilliseconds / dicionarioResultado.Count);

            label4.Text = "Mensagens perdidas: " + perdidas.ToString();
            label5.Text = "Média de tempo: " + media.ToString("ss':'fff");

            button1.Text = "Iniciar Teste";
            button1.Enabled = true;
        }

        private void button3_Click(object sender, EventArgs e)
        {
            try
            {
                dicionarioResultado = new Dictionary<int, TimeSpan>();
                dicionarioTeste = new Dictionary<int, DateTime>();
                CreateQueue(textBox2.Text, conn);
                button3.Enabled = false;
                textBox2.Enabled = false;
                button1.Enabled = true;
                queue = textBox2.Text;

                Thread thread = new Thread(() => subscriber(queue, conn));
                thread.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                throw;
            }

        }

        private void trackBar1_Scroll(object sender, EventArgs e)
        {
            data2send = " teste de performance";

            for (int i = 0; i < trackBar1.Value - 21; i++)
            {
                data2send += "a";
            }

            label8.Text = trackBar1.Value.ToString();
        }

        private void Resultado_Click(object sender, EventArgs e)
        {

        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            conn.Close();
        }
    }
}
