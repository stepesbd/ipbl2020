from flask import Flask, request, jsonify, render_template
from flaskext.mysql import MySQL
from datetime import datetime

app = Flask(__name__)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'stepesbd2020'
app.config['MYSQL_DATABASE_DB'] = 'stepes_bd'
app.config['MYSQL_DATABASE_HOST'] = 'stepesbd.ddns.net'
app.config['MYSQL_DATABASE_PORT'] = 6603
mysql.init_app(app)
conn = mysql.connect()
cursor = conn.cursor()


@app.route('/dashboard/api/obitos/covid', methods=['GET'])
def get_tasks():
    cursor.execute("select count(*) qty from patient where causa_mortis = 'COVID';")
    qty = int(cursor.fetchone()[0])
    return jsonify({'obitos': str(qty)}), 201


@app.route('/patient/api/kill', methods=['PUT'])
def create_task():
    if not request.json or not 'id' in request.json:
        return jsonify({'message': 'ID not found'}), 400

    cursor.execute("select count(*) qty from patient where pat_id = " + request.json['id'] + ";")
    qty = int(cursor.fetchone()[0])

    if qty == 0:
        return jsonify({'message': 'ID not found'}), 400

    pat_death_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute(
        "update patient set causa_mortis = %s, pat_death_date = %s, pat_death_certificate = %s, pat_status = 3 where pat_id = %s;",
        (request.json['causa_mortis'], pat_death_date, request.json['certidao_obito_id'], request.json['id']))
    conn.commit()
    return jsonify({'message': str(cursor.rowcount) + ' patient(s) updated.'}), 201


if __name__ == '__main__':
    app.run()