import psycopg2
import time
import logging
from database import Database
from flask import Flask, request
from flask_cors import CORS
from constants import *
from contacts_handler import *
from groups_handler import *
from operators_handler import *

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

@app.route('/contacts/<int:contact_id>', methods = [GET])
def read_contact(contact_id):
    return read_contact_handler(database, contact_id)

@app.route('/contacts/page/<int:page_id>', methods = [GET])
def read_contacts_paginated(page_id):
    return read_contacts_paginated_handler(database, page_id)

@app.route('/contacts/page/<int:page_id>/filter', methods = [GET])
def read_contacts_paginated_filtered(page_id):
    print(page_id)
    f_name = request.args.get('name', None)
    f_mobile_network_operator = request.args.get('mobile_network_operator', None)
    f_phone_number = request.args.get('phone_number', None)
    f_group_id = request.args.get('group_id', None)
    print(f_name)
    print(f_mobile_network_operator)
    print(f_phone_number)
    print(f_group_id)
    return read_contacts_paginated_filtered_handler(database, page_id, f_name, f_mobile_network_operator, f_phone_number, f_group_id)

@app.route('/contacts', methods = [POST])
def insert_contact():
    body = request.get_json(force = True)
    print(body)
    return insert_contact_handler(database, json.dumps(body))

@app.route('/contacts/<int:person_id>/phone_numbers', methods = [POST])
def insert_phone_number_to_contact(person_id):
    body = request.get_json(force = True)
    return insert_phone_number_to_contact_handler(database, person_id, json.dumps(body))

@app.route('/contacts/count', methods = [GET])
def read_contacts_count():
    return read_contacts_count_handler(database)

@app.route('/contacts/count/filter', methods = [GET])
def read_contacts_paginated_filtered_count():
    f_name = request.args.get('name', None)
    f_mobile_network_operator = request.args.get('mobile_network_operator', None)
    f_phone_number = request.args.get('phone_number', None)
    f_group_id = request.args.get('group_id', None)
    print(f_name)
    print(f_mobile_network_operator)
    print(f_phone_number)
    print(type(f_group_id))
    return read_contacts_paginated_filtered_count_handler(database, f_name, f_mobile_network_operator, f_phone_number, f_group_id)

@app.route('/contacts/<int:contact_id>', methods = [DELETE])
def delete_contact(contact_id):
    return delete_contact_handler(database, contact_id)

@app.route('/phone_numbers/<int:phone_number_id>', methods = [DELETE])
def delete_phone_number(phone_number_id):
    return delete_phone_number_handler(database, phone_number_id)

@app.route('/groups', methods = [GET])
def read_groups():
    return read_groups_handler(database)

@app.route('/groups', methods = [POST])
def insert_group():
    body = request.get_json(force = True)
    return insert_group_handler(database, json.dumps(body))

@app.route('/contacts/<int:contact_id>/groups', methods = [POST])
def insert_contact_to_group(contact_id):
    body = request.get_json(force = True)
    return insert_contact_to_group_handler(database, contact_id, json.dumps(body))

@app.route('/contacts/<int:contact_id>/groups/<int:group_id>', methods = [DELETE])
def delete_contact_from_group(contact_id, group_id):
    return delete_contact_from_group_handler(database, contact_id, group_id)

@app.route('/groups/<int:group_id>', methods = [GET])
def read_group(group_id):
    return read_group_handler(database, group_id)

@app.route('/groups/<int:group_id>', methods = [DELETE])
def delete_group(group_id):
    print(group_id)
    return delete_group_handler(database, group_id)

@app.route('/operators', methods = [GET])
def read_operators():
    return read_operators_handler(database)

@app.route('/operators', methods = [POST])
def insert_operator():
    body = request.get_json(force = True)
    return insert_operator_handler(database, json.dumps(body))

@app.route('/operators/<int:operator_id>', methods = [PUT])
def update_operator(operator_id):
    body = request.get_json(force = True)
    return update_operator_handler(database, operator_id, json.dumps(body))

@app.route('/contacts/<int:contact_id>', methods = [PUT])
def update_contact(contact_id):
    body = request.get_json(force = True)
    return update_contact_handler(database, contact_id, json.dumps(body))

@app.route('/groups/<int:group_id>', methods = [PUT])
def update_group(group_id):
    body = request.get_json(force = True)
    return update_group_handler(database, group_id, json.dumps(body))

if __name__ == '__main__':
    app.run('0.0.0.0', port = 6001)