#script para armazenar os nomes no sqlite
import sqlite3
import csv

conn = sqlite3.connect('cargas.db')
cursor = conn.cursor()

with open('nomes.txt', 'r', encoding='utf8') as arquivo:
    leitor = csv.reader(arquivo)
    dados = list(leitor)

tuples = [(x[0],) for x in dados[1:]]

print(tuples)

cursor.executemany('insert into nome values (?)', tuples)
conn.commit()

cursor.close()
conn.close()