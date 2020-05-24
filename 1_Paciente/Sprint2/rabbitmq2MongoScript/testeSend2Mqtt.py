#!/usr/bin/env python
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='mqtt2mongo')

channel.basic_publish(exchange='', routing_key='mqtt2mongo', body='{ "name": "joao", "address": "rua 9 de abril 123" }')
print(" [x] Sent message'")
connection.close()