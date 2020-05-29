#!/usr/bin/env python
import pika
import time
from threading import Thread

credentials = pika.PlainCredentials('guest', 'stepesbd2020')
parameters = pika.ConnectionParameters('stepesbd.ddns.net',
                                   5672,
                                   '/',
                                   credentials)

connection = pika.BlockingConnection(parameters)

channel = connection.channel()

channel.queue_declare(queue='mqtt2mongo')
queue2ack = 'teste_manfrim'
channel.queue_declare(queue=queue2ack)

def callback(ch, method, properties, body): 
    print(body)

def myfunc():
    channel.basic_consume(queue=queue2ack, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()

t = Thread(target=myfunc)
t.start()

input("...\n")

#Insert
print('Inserting...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"ack_queue": "'+queue2ack+'", "operation": "insert", "name": "test" }')
input("...\n")

#Get
print('Geting...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"ack_queue": "'+queue2ack+'", "operation": "get", "attribute": "name", "value": "test" }')
input("...\n")

#Update
print('Updating...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"ack_queue": "'+queue2ack+'", "operation": "update", "attribute": "name", "value": "test", "new_value": "test2" }')
input("...\n")

#Remove
print('removing...')
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{"ack_queue": "'+queue2ack+'", "operation": "remove", "attribute": "name", "value": "test2" }')
input("...\n")

t.join

channel.stop_consuming

channel.queue_delete(queue=queue2ack)

connection.close()