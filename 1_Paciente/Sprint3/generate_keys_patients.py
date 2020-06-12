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

r = cursor_mysql.execute('select per.per_id from person per inner join patient pat on per.per_id = pat.per_id where per.per_public_key is null and pat.pat_status = 1')
all = cursor_mysql.fetchall()
i=0

for per_id in all:
    keys = requests.get('https://stepesbdmedrecords.herokuapp.com/api/keypair')
    public = keys.json()['PublicKey']
    private = keys.json()['PrivateKey']
    i = i+1

    #print(per_id)
    time_ini = datetime.now()
    #print('TIME DIFF (H:M:S:MS): ' + str(datetime.now()-time_ini))

    if type(per_id) is not tuple:
        break

    time_ini = datetime.now()
    data = (public, private, per_id[0])

    cursor_mysql.execute('update person set per_public_key = %s, per_private_key = %s where per_id = %s', data)
    if (i % 100) == 0:
        conn_mysql.commit()

    #print('TIME DIFF (H:M:S:MS): ' + str(datetime.now()-time_ini))
    #time.sleep(0.3)


conn_mysql.close()
