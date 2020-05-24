Pacotes necessários:

pip install pika
python -m pip install pymongo
pip install pymongo[srv]

Arquivos:

testeSend2Mqtt.py - envia uma mensagem para o um topico do servidor mqtt

testeSend2Mongo.py - envia um dado para uma colection do banco de dados nosql mongodb

rabbitmq2mongo.py - fica escutando um tópico do servidor mqtt, e retransmite mensagens (jsons validos) para o servidor mongodb

