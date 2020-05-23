import pika
from pymongo import MongoClient
from bson.json_util import loads, dumps

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
    print(" [x] Received " % body)
    mycol.insert_one(loads(body))

# Creating RabbitMQ consumer
channel.basic_consume(
    queue='mqtt2mongo', on_message_callback=callback, auto_ack=True)


print('Waiting for messages. To exit press CTRL+C')
# Running RabbitMQ consumer
channel.start_consuming()