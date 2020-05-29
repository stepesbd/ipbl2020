namespace testeSend2MqttDotNetCore
{
    public class atendimentoInsert
    {
        public string operation { get; set; } // insert, delete, get, update
        public string ack_queue  { get; set; } // ts_01_ack_queue     
        public string nome { get; set; }

        public atendimentoInsert(string ack, string n)
        {
            operation = "insert";
            ack_queue = ack;
            nome = n;
        }
    }
}