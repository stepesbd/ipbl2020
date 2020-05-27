from pymongo import MongoClient

# Creating MongoDB Connection
client = MongoClient("mongodb+srv://stepesbd:stepesbd@stepesbd-8e6rc.mongodb.net/test?retryWrites=true&w=majority")
# select database
mydb = client["STEPESBD"]

# select collection
mycol = mydb["ATENDIMENTOS"]

# data to send
mydict = { "name": "joao", "address": "rua 9 de abril 123" }

# send to database
x = mycol.insert_one(mydict)
