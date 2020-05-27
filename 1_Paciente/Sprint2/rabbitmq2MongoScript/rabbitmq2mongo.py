import pika
from pymongo import MongoClient
from bson.json_util import loads, dumps
import json

# Creating MongoDB Connection
client = MongoClient("mongodb+srv://stepesbd:stepesbd@stepesbd-8e6rc.mongodb.net/test?retryWrites=true&w=majority")
# select database
mydb = client["STEPESBD"]

# select collection
mycol = mydb["ATENDIMENTOS"]

# RabbitMQ connection config
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# Create Queue on RabbitMQ (Optional)
channel.queue_declare(queue='mqtt2mongo')

# Callback of received message event
def callback(ch, method, properties, body): 
    obj = json.loads(body)   
    print(obj['operation'])
    if (obj['operation']) == 'insert':
        mycol.insert_one(loads(body))
    elif (obj['operation']) == 'get':
        #for x in mycol.find({},{ "_id": 0, "name": 1, "address": 1 }):
        for x in mycol.find():
            print(x)
    elif (obj['operation']) == 'remove':
        myquery = {obj['attribute']:obj['value']}
        mycol.delete_many(myquery)
    elif (obj['operation']) == 'update':
        myquery = {obj['attribute']:obj['value']}
        newvalues = { "$set": {obj['attribute']:obj['new_value']} }
        mycol.update_many(myquery,newvalues)

    #mycol.insert_one(loads(body))
    #print("Sent 2 mongo")

# Creating RabbitMQ consumer
channel.basic_consume(
    queue='mqtt2mongo', on_message_callback=callback, auto_ack=True)


print('Waiting for messages...')
# Running RabbitMQ consumer
while 1:
    #channel.start_consuming()      
    try:
        channel.start_consuming()        
    except:
        print("An exception occurred")
