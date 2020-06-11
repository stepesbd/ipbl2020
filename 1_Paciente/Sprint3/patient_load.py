import mysql.connector
import sqlite3
from mysql.connector import Error
from datetime import datetime
import random
import time


def get_first_name():
    r = cursor_sqlite.execute('select * from nome where rowid = ?', (random.randint(1, int(qty_nomes)),))
    return r.fetchone()[0].capitalize()

def get_last_name():
    r = cursor_sqlite.execute('select * from sobrenome where rowid = ?', (random.randint(1, int(qty_sobrenomes)),))
    return r.fetchone()[0].capitalize()

def get_birth():
    return str(random.randint(1920,2019)) + '-' + str(random.randint(1,12)).rjust(2, '0') + '-' + str(random.randint(1,27)).rjust(2, '0')

def get_cpf():
    #numero aleatorio de 0 - 99999999999 - convertido pra string, completado com 0 a esquerda
    return str(random.randint(1, 99999999999)).rjust(11, '0')

def get_sus_number():
    return random.randint(1, 9999999)

def get_blood_group():
    return random.choice(['A', 'B', 'O', 'AB'])

def get_rh_factor():
    return random.choice(['+', '-'])

def get_inclusion_date():
    #data de hoje
    pass

def get_address():
    #pegar um endereço aleatorio na base
    number = random.randint(1, 10000)

    r = cursor_sqlite.execute('select * from endereco where rowid = ?', (random.randint(1, int(qty_enderecos)),))
    address = list(r.fetchone())

    address.append('São José dos Campos')
    address.append('SP')
    address.append('Brasil')
    address.append(number)

    return tuple(address)

try:
    #Connection MYSQL
    conn_mysql = mysql.connector.connect(host='stepesbd.ddns.net', database='stepes_bd', user='root', password='stepesbd2020', port='6603')
    cursor_mysql = conn_mysql.cursor()

    #Connection SQLite
    conn_sqlite = sqlite3.connect('cargas.db')
    cursor_sqlite = conn_sqlite.cursor()

    #Quantidade Pacientes na base de dados
    cursor_mysql.execute("select count(*) as qty_patients from patient;")
    qty_patients = str(cursor_mysql.fetchone()[0])

    #Quantidade de endereços cadastrados
    cursor_sqlite.execute("select count(*) from endereco;")
    qty_enderecos = str(cursor_sqlite.fetchone()[0])

    #Qauntidade de nomes cadastrados
    cursor_sqlite.execute("select count(*) from nome;")
    qty_nomes = str(cursor_sqlite.fetchone()[0])

    #Quantidade de sobrenomes cadastrados
    cursor_sqlite.execute("select count(*) from sobrenome;")
    qty_sobrenomes = str(cursor_sqlite.fetchone()[0])

    time_ini = datetime.now()
    print('INICIO DO SCRIPT: ' + str(time_ini))
    option = input('**************************\nSCRIPT PARA CARGA DE PACIENTES\n**************************\nATENÇÃO:\n- ' + qty_patients + ' pacientes cadastrados no MYSQL\n- '+qty_enderecos+' Endereços carregados no SQLite\n- '+qty_nomes+' nomes carregados no SQLite\n- '+qty_sobrenomes+' sobrenomes carregados no SQLite\nSe você continuar, irá fazer a carga de 1.000.000 de pacientes na base de dados! Tem certeza que deseja continuar? [s/n] ')

    if option != 's':
        print('[' + datetime.now().strftime("%H:%M:%S") + '] O script será encerrado!\nObrigado\nSTEPES-BD 2020 - ITA')
        exit()

    i = 0
    max_transactions_per_commit = 500
    max_load_patients = 450000
    conn_mysql.autocommit = False
    while i < max_load_patients:
        i = i+1

        address = get_address()
        #print(address)
        cursor_mysql.execute('INSERT INTO address (add_street, add_zipcode, add_latitude, add_longitude, add_neighborhood, add_city, add_state, add_country, add_number) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)', address)
        address_id = cursor_mysql.getlastrowid()

        person = (get_first_name(), get_last_name(), get_birth(), get_cpf(), address_id)
        cursor_mysql.execute('INSERT INTO person (per_first_name, per_last_name, per_birth, per_cpf, add_id) VALUES (%s,%s,%s,%s,%s)', person)
        person_id = cursor_mysql.getlastrowid()
        #print(person)

        patient = (get_sus_number(), get_blood_group(), get_rh_factor(), datetime.now().strftime("%Y-%m-%d"), 1, person_id)
        cursor_mysql.execute('INSERT INTO patient (pat_sus_number, pat_blood_group, pat_rh_factor, pat_inclusion_date, pat_status, per_id) VALUES (%s,%s,%s,%s,%s,%s)', patient)
        patient_id = cursor_mysql.getlastrowid()
        #print(patient)

        if i % max_transactions_per_commit == 0:
            conn_mysql.commit()




except Error as e:
    print("Error ", e)
    conn_mysql.rollback()
finally:
    #End Connection MYSql
    cursor_mysql.close()
    conn_mysql.close()

    #End Connection SQLite
    cursor_sqlite.close()
    conn_sqlite.close()

    print('[' + datetime.now().strftime("%H:%M:%S") + '] Conn is closed')

    time_fim = datetime.now()
    print('FIM DO SCRIPT: ' + str(time_fim))
    print('TIME DIFF (H:M:S:MS): ' + str(time_fim-time_ini))
