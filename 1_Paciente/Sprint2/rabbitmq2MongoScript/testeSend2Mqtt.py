#!/usr/bin/env python
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='mqtt2mongo')
#Insert
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{ "operation": "insert", "name": "test" }')

input("Press Enter to continue...")

#Get
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{ "operation": "get" }')

input("Press Enter to continue...")

#Update
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{ "operation": "update", "attribute": "name", "value": "test", "new_value": "test2" }')

input("Press Enter to continue...")

#Remove
channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{ "operation": "remove", "attribute": "name", "value": "test2" }')

connection.close()