import pika
from pymongo import MongoClient
from bson.json_util import loads, dumps
import json
import time
import re

# Creating MongoDB Connection
client = MongoClient("mongodb://localhost:27017")
# select database
mydb = client["stepesbd"]

# select collection
mycol = mydb["atendimentos"]

# RabbitMQ connection config
credentials = pika.PlainCredentials('guest', 'stepesbd2020')
parameters = pika.ConnectionParameters('localhost',
                                   5672,
                                   '/',
                                   credentials)

connection = pika.BlockingConnection(parameters)
channel = connection.channel()

# Create Queue on RabbitMQ (Optional)
channel.queue_declare(queue='mqtt2mongo', durable=True)


def sendAck(ackMessage,queue2Send):
    print('Enviando no topico ' + queue2Send +': ' +ackMessage)
    channel.basic_publish(exchange='', routing_key=queue2Send, body= ackMessage )

# Callback of received message event
def callback(ch, method, properties, body): 
    try:        
        obj = json.loads(body)  
        try:
            q_ack = str(obj['ack_queue']) 
        except:
            q_ack = 'invalid'
            print('invalid ack_queue')
        print('received: '+q_ack+' '+obj['operation'])
        if (obj['operation']) == 'insert':
            mycol.insert_one(loads(body))            
        elif (obj['operation']) == 'get':

            if (obj['attribute']) == 'all':
                for x in mycol.find({}):
                    toSend = re.sub(r'[\000-\011\013-\037]', '', str(x))
                    toSend = re.sub(',\n}$', '\n}', toSend)
                    sendAck(toSend,q_ack)
            else:
                for x in mycol.find({ obj['attribute']:obj['value'] }):                         
                    toSend = re.sub(r'[\000-\011\013-\037]', '', str(x))
                    toSend = re.sub(',\n}$', '\n}', toSend)
                    sendAck(toSend,q_ack)

        elif (obj['operation']) == 'remove':
            myquery = {obj['attribute']:obj['value']}
            mycol.delete_many(myquery)
        elif (obj['operation']) == 'update':
            myquery = {obj['attribute']:obj['value']}
            newvalues = { "$set": {obj['attribute']:obj['new_value']} }
            mycol.update_many(myquery,newvalues)        
    except:
        try:
            sendAck('ERROR',q_ack)
        except:
            print('no queue to ack')
    sendAck('OK',q_ack)
    print('Msg OK!')

# Creating RabbitMQ consumer
channel.basic_consume(queue='mqtt2mongo', on_message_callback=callback, auto_ack=True)


print('Waiting for messages...')
# Running RabbitMQ consumer
while 1:      
    try:
        channel.start_consuming()        
    except:
        print("An exception occurred")
