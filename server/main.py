import psycopg2
import time
import logging
from database import Database
from flask import Flask, request
from flask_cors import CORS
from constants import *
from contacts_handler import *

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("[MAIN]")

log.info('Server starting...')
log.info('Connecting to the database...')

database = Database()

log.info('Server is up and running!')

@app.route('/contacts', methods = [GET])
def read_contacts():
    return read_contacts_handler(database)

@app.route('/contacts/page/<int:page_id>', methods = [GET])
def read_contacts_paginated(page_id):
    return read_contacts_paginated_handler(database, page_id)

@app.route('/contacts/page/<int:page_id>/filter')
def read_contacts_paginated_filtered(page_id):
    print(page_id)
    f_name = request.args.get('name', None)
    f_mobile_network_operator = request.args.get('mobile_network_operator', None)
    f_phone_number = request.args.get('phone_number', None)
    print(f_name)
    print(f_mobile_network_operator)
    print(f_phone_number)
    return read_contacts_paginated_filtered_handler(database, page_id, f_name, f_mobile_network_operator, f_phone_number)

@app.route('/contacts', methods = [POST])
def insert_contact():
    body = request.get_json(force = True)
    return insert_contact_handler(database, json.dumps(body))

@app.route('/contacts/<int:person_id>/phone_numbers', methods = [POST])
def insert_phone_number_to_contact(person_id):
    body = request.get_json(force = True)
    return insert_phone_number_to_contact_handler(database, person_id, json.dumps(body))

@app.route('/contacts/count', methods = [GET])
def read_contacts_count():
    return read_contacts_count_handler(database)

@app.route('/contacts/count/filter')
def read_contacts_paginated_filtered_count():
    f_name = request.args.get('name', None)
    f_mobile_network_operator = request.args.get('mobile_network_operator', None)
    f_phone_number = request.args.get('phone_number', None)
    print(f_name)
    print(f_mobile_network_operator)
    print(f_phone_number)
    return read_contacts_paginated_filtered_count_handler(database, f_name, f_mobile_network_operator, f_phone_number)

if __name__ == '__main__':
    app.run('0.0.0.0', port = 6001)