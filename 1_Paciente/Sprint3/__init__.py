from flask import Flask, request, jsonify, render_template
from flaskext.mysql import MySQL
from datetime import datetime
from flask_cors import CORS
import random

app = Flask(__name__)
cors = CORS(app, resources={r"/address/api/latlong": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'stepesbd2020'
app.config['MYSQL_DATABASE_DB'] = 'stepes_bd'
app.config['MYSQL_DATABASE_HOST'] = '172.17.0.5'
app.config['MYSQL_DATABASE_PORT'] = 3306
mysql.init_app(app)
conn = mysql.connect()
conn.autocommit(True)
cursor = conn.cursor()


@app.route('/simulation/api/attendance', methods=['GET', 'OPTIONS'])
def get_simulation_attendance():
    time_ini = datetime.now()
    all_symptoms = ['Tosse', 'Pigarro', 'Diarreia', 'Febre', 'Fadiga', 'Anorexia', 'Dispneia',
                    'Dor ou Pressão no Peito', 'Escarro', 'Mialgias', ' Dor de Garganta', 'Conjuntivite', 'Náuseas',
                    'Cefaleia', 'Alteração da Coloração da Pele', 'Perda Paladar ou Olfato', 'Tontura', 'Rinorreia']
    symptoms = random.sample(all_symptoms, random.randint(1, 8))

    def query_between(fullscan=False):
        if fullscan:
            cursor.execute('select * from person natural join patient natural join address \
	                        where \
	                        per_public_key is not null \
	                        and pat_status = 1 \
	                        order by rand() limit 1')
        else:
            cursor.execute('select * from person natural join patient natural join address \
	                        where \
	                        per_public_key is not null \
	                        and pat_status = 1 \
	                        and per_id between \
	                            (select (ceil(max(per_id)/60) * substr(curtime(), -2)) min from person) \
	                            and \
	                            (select (ceil(max(per_id)/60) * (1+(substr(curtime(), -2)))) max from person) \
	                        order by rand() limit 1')

    query_between(fullscan=False)
    r_patient = cursor.fetchone()

    if r_patient is None:
        query_between(fullscan=True)
        r_patient = cursor.fetchone()

    field_patient = [field[0] for field in cursor.description]
    patient = dict(zip(field_patient, r_patient))

    cursor.execute('select name, crm, public_key, private_key from physicians where public_key is not null order by rand() limit 1')
    r_physicians = cursor.fetchone()
    field_physicians = [field[0] for field in cursor.description]
    physicians = dict(zip(field_physicians, r_physicians))

    json = jsonify({
        'Querytime': ((datetime.min + (datetime.now() - time_ini)).time().strftime("%S.%f")),
        'Medico': {
            'Nome': physicians['name'],
            'CRM': physicians['crm'],
            'PrivateKey': physicians['private_key'],
            'PublicKey': physicians['public_key']
        },
        'Paciente': {
            'Id': patient['pat_id'],
            'Nome': patient['per_first_name'] + ' ' + patient['per_last_name'],
            'PrivateKey': patient['per_private_key'],
            'PublicKey': patient['per_public_key'],
            'GrupoSanguineo': patient['pat_blood_group'],
            'FatorRH': patient['pat_rh_factor'],
            'Nascimento': patient['per_birth'],
            'CPF': patient['per_cpf'],
            'Endereco': {
                'Rua': patient['add_street'],
                'Numero': patient['add_number'],
                'Bairro': patient['add_neighborhood'],
                'UF': patient['add_state'],
                'CEP': patient['add_zipcode']
            }
        },
        'Atendimento': {
            'Sintomas': symptoms,
            'Estado': random.choice(['Leve', 'Moderado', 'Grave']),
            'Comentarios': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut bibendum mi vitae consectetur ornare. Phasellus ut pellentesque odio, nec congue elit. Nam elit magna, venenatis ut consectetur vel, mattis sed elit. Donec commodo diam ac tellus eleifend, ultricies commodo velit semper. Donec feugiat, nisi ac imperdiet gravida, diam ipsum mattis leo, eu tempor libero erat eu ante. Maecenas blandit libero vitae urna tempor imperdiet. Phasellus eget magna turpis. Quisque sed lacus pharetra, mattis tortor sit amet, volutpat nibh. Morbi lobortis tellus lorem, vitae vulputate erat tincidunt ac. Proin nisl orci, tincidunt rhoncus erat et, vulputate varius massa. Pellentesque accumsan pretium.'
        }
    })

    return json, 201


@app.route('/dashboard/api/obitos/covid', methods=['GET', 'OPTIONS'])
def get_tasks():
    cursor.execute("select count(*) as qty from patient where causa_mortis = %s;", ('COVID-19',))

    return jsonify({'obitos': cursor.fetchone()[0]}), 201


@app.route('/patient/api/', methods=['GET', 'OPTIONS'])
def get_patient():
    if not request.json or not 'id' in request.json:
        return jsonify({'message': 'ID not found'}), 400

    cursor.execute("SELECT * FROM patient natural join person where pat_id = %s;", (request.json['id'],))
    values = cursor.fetchone()
    field_name = [field[0] for field in cursor.description]
    row = dict(zip(field_name, values))
    return jsonify({'patient': row}), 201


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

    return jsonify({'message': str(cursor.rowcount) + ' patient(s) updated.'}), 201


if __name__ == '__main__':
    app.run()
