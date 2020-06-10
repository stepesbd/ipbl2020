import mysql.connector
from mysql.connector import Error
from datetime import datetime

try:
    conn = mysql.connector.connect(host='stepesbd.ddns.net', database='stepes_bd', user='root', password='stepesbd2020', port='6603')

    if conn.is_connected():
        cursor = conn.cursor()
        cursor.execute("select count(*) as qty_patients from patient;")
        qty_patients = str(cursor.fetchone()[0])

        option = input('**************************\nSCRIPT PARA CARGA DE PACIENTES\n**************************\nATENÇÃO: Já existem ' + qty_patients + ' pacientes cadastrados!\nSe você continuar, irá fazer a carga de 1.000.000 de pacientes na base de dados! Tem certeza que deseja continuar? [s/n] ')

        if option != 's':
            print('[' + datetime.now().strftime("%H:%M:%S") + '] O script será encerrado!\nObrigado\nSTEPES-BD 2020 - ITA')
            exit()



except Error as e:
    print("Error ", e)
finally:
    if conn.is_connected():
        conn.close()
        print('[' + datetime.now().strftime("%H:%M:%S") + '] Conn is closed')
