namespace testeSend2MqttDotNetCore
{
    public class atendimentoInsert
    {
        public string operation { get; set; }
        public string ack_queue  { get; set; }      
        public string nome { get; set; }

        public atendimentoInsert(string ack, string n)
        {
            operation = "insert";
            ack_queue = ack;
            nome = n;
        }
    }
}