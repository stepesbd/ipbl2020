#script para armazenar os sobrenomes no sqlite
import pandas as pd
import sqlite3
import json

conn = sqlite3.connect('cargas.db')
cursor = conn.cursor()
df = pd.read_csv('sobrenomes.csv')

x = df.to_json()

json = json.loads(x)
a_dict = (dict(json['SOBRENOME']))

a_list = list(a_dict.values())

max_transction = 100
transaction = 0

tuples = [(x.capitalize(),) for x in a_list]
print(tuples)

cursor.executemany('insert into sobrenome values (?)', tuples)
conn.commit()

cursor.close()
conn.close()