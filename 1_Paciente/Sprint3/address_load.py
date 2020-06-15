import sqlite3
import random
import requests
import time

#script para selecionar 1000 enderecos aleatorios em SJC
#salva no sqlite

#configura o maximo de enderecos necessarios
max_address = 1000

#conexao com BD
conn = sqlite3.connect('cargas.db')
cursor = conn.cursor()

def build_address():
    try:
        # inicializa o contador de enderecos
        cursor.execute('select count(*) from endereco')
        found = int(cursor.fetchone()[0])

        while True:
            #escolhe um cep aleatorio dentro de um range setado para SJC
            cep = random.randrange(12210000, 12247820)

            #invoca a API de enderecos
            get_address = 'https://www.cepaberto.com/api/v3/cep?cep='+str(cep)
            headers = {'Authorization': 'Token token=ed3c65f56f6e7ff359d039cd7118de57'}
            r = requests.get(get_address, headers=headers)
            address = r.json()

            #se nao encontrou o endereco, continua loop
            if not address:
                time.sleep(0.3)
                continue

            #achou o endereco, incremenda contador
            ++found

            #configura a tupla
            tuple = (address['logradouro'], cep, address['latitude'], address['longitude'], address['bairro'])

            #insere no banco de dados
            cursor.execute('insert into endereco values (?,?,?,?,?)', tuple)
            conn.commit()

            #encerra, caso jah tenha atingido o numero maximo de enderecos
            if found == max_address:
                break
    except Exception as e:
        print(e)
        build_address()
    finally:
        cursor.close()
        conn.close()

build_address()


