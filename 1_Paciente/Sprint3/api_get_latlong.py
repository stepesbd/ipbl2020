from flask import Flask, request, jsonify, render_template
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/address/api/latlong": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/address/api/latlong', methods=['GET','OPTIONS'])
def get_tasks():
    conn = sqlite3.connect('cargas.db')
    cursor = conn.cursor()

    cursor.execute("select add_latitude, add_longitude from endereco")
    all = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(all)





if __name__ == '__main__':
    app.run()