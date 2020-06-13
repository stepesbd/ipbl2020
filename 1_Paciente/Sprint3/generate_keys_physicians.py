#gera as chaves para o bigchain nos pacientes

import requests
import mysql.connector
from datetime import datetime
import time

# Connection MYSQL
conn_mysql = mysql.connector.connect(host='stepesbd.ddns.net', database='stepes_bd', user='root',
                                     password='stepesbd2020', port='6603')
cursor_mysql = conn_mysql.cursor(buffered=True)
conn_mysql.autocommit = False

r = cursor_mysql.execute('select phy.id from physicians phy where phy.public_key is null')
all = cursor_mysql.fetchall()
i=0

for phy_id in all:
    keys = requests.get('https://stepesbdmedrecords.herokuapp.com/api/keypair')
    public = keys.json()['PublicKey']
    private = keys.json()['PrivateKey']
    i = i+1

    if type(phy_id) is not tuple:
        break

    time_ini = datetime.now()
    data = (public, private, phy_id[0])

    cursor_mysql.execute('update physicians set public_key = %s, private_key = %s where id = %s', data)

    conn_mysql.commit()


conn_mysql.close()
