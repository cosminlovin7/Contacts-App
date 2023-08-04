from flask import Flask, make_response, request
import json
import psycopg2
from phone_number import PhoneNumber
from mobile_network_operator import MobileNetworkOperator
from person import Person
from dto.contacts_dto import ContactsDto, PhoneNumberDto
from constants import *

"""
verify if the request body received has the correct format
"""
def check_contact_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if (("firstName" not in body_dict) | ("lastName" not in body_dict) | ("phoneNumber" not in body_dict)):
        return False

    if ((isinstance(body_dict["firstName"], str) == False) 
        | (isinstance(body_dict["lastName"], str) == False)
        | (isinstance(body_dict["phoneNumber"], str) == False)):
        return False

    return True

"""
verify the validity of the values received in the request body
"""
def check_contact_valid_json(contact_cmd):
    if (len(contact_cmd['firstName']) > 50):
        return False
    
    if (len(contact_cmd['lastName']) > 50):
        return False
    
    if (len(contact_cmd['phoneNumber']) != 10):
        return False
    
    return True

def check_phone_number_to_contact_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if ("phoneNumber" not in body_dict):
        return False

    if (isinstance(body_dict["phoneNumber"], str) == False):
        return False

    return True

def check_phone_number_to_contact_valid_json(phone_number_to_contact_cmd):
    if (len(phone_number_to_contact_cmd['phoneNumber']) != 10):
        return False
    
    return True

def extract_contacts_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        contact_obj = ContactsDto(elements[0], elements[1], elements[2], elements[3], elements[4], elements[5], elements[6])
        list.append(contact_obj.getDictionary())

    return list

def read_contacts_handler(database):
    database_cursor = database.instance.cursor()
    
    database_cursor.execute("SELECT read_contacts();", ())
    query_result = database_cursor.fetchall()

    contact_list = extract_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def read_contacts_paginated_handler(database, page_id):
    database_cursor = database.instance.cursor()
    
    database_cursor.execute("SELECT read_contacts_page('%s');", (page_id * 10,))
    query_result = database_cursor.fetchall()

    contact_list = extract_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def read_contacts_count_handler(database):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contacts_count();", ())
    query_result = database_cursor.fetchall()
    contacts_count = query_result[0][0]

    result = {"contact": contacts_count}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
@returns MobileNetworkOperator object from converting the query_result
obtained from the find_mobile_network_operator function
"""
def extract_mobile_network_operator(query_result):
    mobile_network_operator = None
    if (len(query_result) != 0):
        elements = query_result[0][0].strip('()').split(',')
        mobile_network_operator = MobileNetworkOperator(elements[0], elements[1], elements[2])
    
    return mobile_network_operator

"""
searches for the mobile_network_operator by operator_number to see if 
there is any information about the operator_number
"""
def find_mobile_network_operator_by_operator_number(database, operator_number):
    with database.instance.cursor() as cursor:
        cursor.execute("SELECT read_one_mobile_operator_by_operator_number(%s);", (operator_number,))

        query_result = cursor.fetchall()

        return extract_mobile_network_operator(query_result)

"""
@returns PhoneNumber object from converting the query_result
obtained from the insert_phone_number function
"""
def extract_phone_number(query_result):
    phone_number = None
    if (len(query_result) != 0):
        elements = query_result[0][0].strip('()').split(',')
        phone_number = PhoneNumber(elements[0], elements[1], elements[2])
    
    return phone_number

"""
inserts a new phone number into the database, creating a relationship
with the mobile_network_operator, if found
"""
def insert_phone_number(database, phone_number, mobile_network_operator_obj):
    with database.instance.cursor() as cursor:
        mob_net_operator_id = None
        if (mobile_network_operator_obj is not None):
            mob_net_operator_id = mobile_network_operator_obj.id

        cursor.execute("SELECT insert_phone_number(%s, %s);", (phone_number, mob_net_operator_id))
        database.instance.commit()

        return extract_phone_number(cursor.fetchall())

def extract_person(query_result):
    person = None
    if (len(query_result) != 0):
        elements = query_result[0][0].strip('()').split(',')
        phone_number = Person(elements[0], elements[1], elements[2])
    
    return phone_number

def insert_person(database, first_name, last_name, phone_number_obj):
    with database.instance.cursor() as cursor:
        cursor.execute("SELECT insert_person(%s, %s, %s);", (first_name, last_name, phone_number_obj.id))
        database.instance.commit()

        return extract_person(cursor.fetchall())

def insert_mobile_network_operator_without_operator_name(database, operator_number):
    with database.instance.cursor() as cursor:
        cursor.execute("SELECT insert_mobile_network_operator_without_operator_name(%s);", (operator_number,))
        database.instance.commit()

        return extract_mobile_network_operator(cursor.fetchall())

"""
inserts a new contact into the database, creating the phone_number objects and 
establishing relationship with the mobile_network_operator, if found
"""
def insert_contact_handler(database, body):
    if (check_contact_json(body) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    contact_cmd = json.loads(body)
    
    if (check_contact_valid_json(contact_cmd) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response

    first_name = contact_cmd['firstName']
    last_name = contact_cmd['lastName']
    operator_number = contact_cmd['phoneNumber'][:3]
    phone_number = contact_cmd['phoneNumber'][-7:]

    mobile_network_operator_obj = None
    try:
        mobile_network_operator_obj = find_mobile_network_operator_by_operator_number(database, operator_number)
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    if mobile_network_operator_obj is None:
        mobile_network_operator_obj = insert_mobile_network_operator_without_operator_name(database, operator_number)

    phone_number_obj = None
    try: 
        phone_number_obj = insert_phone_number(database, phone_number, mobile_network_operator_obj)
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"error": "Phone number already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    if (phone_number_obj is None):
        error_message = {"error": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    person_obj = None
    try:
        person_obj = insert_person(database, first_name, last_name, phone_number_obj)
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The person has been saved successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

def insert_new_phone_number(database, person_id, ph_number, mobile_network_operator_obj):
    with database.instance.cursor() as cursor:
        mob_net_operator_id = None
        if (mobile_network_operator_obj is not None):
            mob_net_operator_id = mobile_network_operator_obj.id

        cursor.execute("CALL insert_phone_number_to_person(%s, %s, %s);", (person_id, ph_number, mob_net_operator_id))
        database.instance.commit()

        return

def insert_phone_number_to_contact_handler(database, person_id, body):
    if (check_phone_number_to_contact_json(body) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    phone_number_to_contact_cmd = json.loads(body)

    if (check_phone_number_to_contact_valid_json(phone_number_to_contact_cmd) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    operator_number = phone_number_to_contact_cmd['phoneNumber'][:3]
    ph_number = phone_number_to_contact_cmd['phoneNumber'][-7:]

    mobile_network_operator_obj = None
    try:
        mobile_network_operator_obj = find_mobile_network_operator_by_operator_number(database, operator_number)
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    if mobile_network_operator_obj is None:
        try:
            mobile_network_operator_obj = insert_mobile_network_operator_without_operator_name(database, operator_number)
        except Exception as e:
            database.instance.rollback()
            error_message = {"error": "An unexpected error occurred.", "type": e}
            response = make_response(error_message, INTERNAL_ERROR)
            response.headers["Content-Type"] = "application/json"
            return response

    try:
        insert_new_phone_number(database, person_id, ph_number, mobile_network_operator_obj)
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"error": "Phone number already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The phone number has been added successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

def read_contacts_paginated_filtered_handler(database, page_id, name, mobile_network_operator, phone_number):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contacts_page_filtered(%s, %s, %s, %s);", (name, mobile_network_operator, phone_number, page_id * 10))
    query_result = database_cursor.fetchall()
    print(query_result)

    contact_list = extract_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def read_contacts_paginated_filtered_count_handler(database, name, mobile_network_operator, phone_number):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contacts_page_filtered_count(%s, %s, %s);", (name, mobile_network_operator, phone_number))
    query_result = database_cursor.fetchall()

    contacts_count = query_result[0][0]

    result = {"contact": contacts_count}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response