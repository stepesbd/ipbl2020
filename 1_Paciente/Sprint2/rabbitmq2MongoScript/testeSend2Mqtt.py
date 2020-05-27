#!/usr/bin/env python
import pika
import time
from threading import Thread

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='mqtt2mongo')
channel.queue_declare(queue='mqtt2mongo_ack')

def callback(ch, method, properties, body): 
    print(body)

def myfunc():
    channel.basic_consume(queue='mqtt2mongo_ack', on_message_callback=callback, auto_ack=True)
    channel.start_consuming()

t = Thread(target=myfunc)
t.start()

input("Press Enter to continue...")

#Insert
print('Inserting...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"operation_id": 1, "operation": "insert", "name": "test" }')
input("Press Enter to continue...")

#Get
print('Geting...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"operation_id": 1, "operation": "get" }')
input("Press Enter to continue...")

#Update
print('Updating...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"operation_id": 1, "operation": "update", "attribute": "name", "value": "test", "new_value": "test2" }')
input("Press Enter to continue...")

#Remove
print('removing...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"operation_id": 1, "operation": "remove", "attribute": "name", "value": "test2" }')
input("Press Enter to continue...")

t.join

connection.close()