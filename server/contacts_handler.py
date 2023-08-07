from flask import Flask, make_response, request
import json
import psycopg2
from phone_number import PhoneNumber
from mobile_network_operator import MobileNetworkOperator
from person import Person
from dto.contacts_dto import FilteredContactsDto, ContactsDto, SingleContactDto, SinglePhoneNumberDto, GroupDto
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
verify if the request body received for update has the correct format
"""
def check_update_contact_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if (("firstName" not in body_dict) | ("lastName" not in body_dict)):
        return False

    if ((isinstance(body_dict["firstName"], str) == False) 
        | (isinstance(body_dict["lastName"], str) == False)):
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
    
    if (len(contact_cmd['firstName']) == 0 and len(contact_cmd['lastName']) == 0):
        return False
    
    if (len(contact_cmd['phoneNumber']) != 10):
        return False
    
    return True

"""
verify the validity of the values received in the request body for the update
"""
def check_update_contact_valid_json(contact_cmd):
    if (len(contact_cmd['firstName']) > 50):
        return False
    
    if (len(contact_cmd['lastName']) > 50):
        return False
    
    if (len(contact_cmd['firstName']) == 0 and len(contact_cmd['lastName']) == 0):
        return False
    
    return True

"""
verify if the request body for inserting a new phone number has the correct format
"""
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

"""
verify the validity of the values received in the request body for inserting a new phone number
"""
def check_phone_number_to_contact_valid_json(phone_number_to_contact_cmd):
    if (len(phone_number_to_contact_cmd['phoneNumber']) != 10):
        return False
    
    return True

"""
converts the query resulted into a list of contacts
"""
def extract_contacts_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        contact_obj = ContactsDto(elements[0], elements[1], elements[2])
        list.append(contact_obj.getDictionary())

    return list

"""
converts the query resulted into a list of filtered contacts
"""
def extract_filtered_contacts_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        contact_obj = FilteredContactsDto(elements[0], elements[1], elements[2], elements[3], elements[4], elements[5], elements[6], elements[7], elements[8])
        list.append(contact_obj.getDictionary())

    return list

"""
reads all the contacts existing
"""
def read_contacts_handler(database):
    database_cursor = database.instance.cursor()
    
    database_cursor.execute("SELECT read_contacts();", ())
    query_result = database_cursor.fetchall()

    contact_list = extract_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
converts the query resulted into a contact
"""
def extract_contact(query_result):
    contact_obj = None
    if (len(query_result) > 0):
        elements = query_result[0].strip('()').split(',')
        contact_obj = SingleContactDto(elements[0], elements[1], elements[2])

    return contact_obj

"""
converts the query resulted into a list of phone numbers for the contact
"""
def extract_contact_phone_numbers(contact_obj, query_result):
    for row in query_result:
        elements = row[0].strip('()').split(',')
        phone_number_obj = SinglePhoneNumberDto(elements[0], elements[1], elements[2], elements[3])
        contact_obj.phone_numbers.append(phone_number_obj)

"""
converts the query resulted into a list of groups for the contact
"""
def extract_contact_groups(contact_obj, query_result):
    for row in query_result:
        elements = row[0].strip('()').split(',')
        group_obj = GroupDto(elements[0], elements[1])
        contact_obj.groups.append(group_obj)

"""
handler for reading a contact, has all the logic implemented
"""
def read_contact_handler(database, contact_id):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contact(%s);", (contact_id,))
    query_result = database_cursor.fetchone()

    contact_obj = None
    if (query_result is not None):
        contact_obj = extract_contact(query_result)

    if (contact_obj is None):
        result = {"message": "The contact was not found."}
        response = make_response(result, NOT_FOUND)
        response.headers["Content-Type"] = "application/json"
        return response

    database_cursor.execute("SELECT read_contact_phone_numbers(%s);", (contact_id,))
    query_result = database_cursor.fetchall()
    print(query_result)
    if (query_result is not None):
        extract_contact_phone_numbers(contact_obj, query_result)

    database_cursor.execute("SELECT read_contact_groups(%s);", (contact_id,))
    query_result = database_cursor.fetchall()
    if (query_result is not None):
        extract_contact_groups(contact_obj, query_result)

    result = {"contact": contact_obj.getDictionary()}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
reads the contacts while doing a pagination so that it only fetches 10 rows at a time
"""
#will not be used anymore
def read_contacts_paginated_handler(database, page_id):
    database_cursor = database.instance.cursor()
    
    database_cursor.execute("SELECT read_contacts_page('%s');", (page_id * 10,))
    query_result = database_cursor.fetchall()

    print(query_result)

    contact_list = extract_filtered_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
reads the total number of contacts in the database
"""
#will not be used anymore
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

"""
converts the query result into a person object
"""
def extract_person(query_result):
    person = None
    if (len(query_result) != 0):
        elements = query_result[0][0].strip('()').split(',')
        person = Person(elements[0], elements[1], elements[2])
    
    return person

"""
inserts a new person into the database
"""
def insert_person(database, first_name, last_name, phone_number_obj):
    with database.instance.cursor() as cursor:
        cursor.execute("SELECT insert_person(%s, %s, %s);", (first_name, last_name, phone_number_obj.id))
        database.instance.commit()

        return extract_person(cursor.fetchall())

"""
inserts a new mobile network operator into the database
"""
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
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    contact_cmd = json.loads(body)
    
    if (check_contact_valid_json(contact_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response

    print(contact_cmd)

    first_name = None
    if contact_cmd['firstName'] != '':
        first_name = contact_cmd['firstName']
    
    last_name = None
    if contact_cmd['lastName'] != '':
        last_name = contact_cmd['lastName']

    operator_number = contact_cmd['phoneNumber'][:3]
    phone_number = contact_cmd['phoneNumber'][-7:]

    mobile_network_operator_obj = None
    try:
        mobile_network_operator_obj = find_mobile_network_operator_by_operator_number(database, operator_number)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
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
        error_message = {"message": "Phone number already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    if (phone_number_obj is None):
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    person_obj = None
    try:
        person_obj = insert_person(database, first_name, last_name, phone_number_obj)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The person has been saved successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

"""
inserts a new phone number for a contact into the database
"""
def insert_new_phone_number(database, person_id, ph_number, mobile_network_operator_obj):
    with database.instance.cursor() as cursor:
        mob_net_operator_id = None
        if (mobile_network_operator_obj is not None):
            mob_net_operator_id = mobile_network_operator_obj.id

        cursor.execute("CALL insert_phone_number_to_person(%s, %s, %s);", (person_id, ph_number, mob_net_operator_id))
        database.instance.commit()

        return

"""
handler for inserting a new phone number for a contact, holds all the logic implemented
"""
def insert_phone_number_to_contact_handler(database, person_id, body):
    if (check_phone_number_to_contact_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    phone_number_to_contact_cmd = json.loads(body)

    if (check_phone_number_to_contact_valid_json(phone_number_to_contact_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
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
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    if mobile_network_operator_obj is None:
        try:
            mobile_network_operator_obj = insert_mobile_network_operator_without_operator_name(database, operator_number)
        except Exception as e:
            database.instance.rollback()
            error_message = {"message": "An unexpected error occurred.", "type": e}
            response = make_response(error_message, INTERNAL_ERROR)
            response.headers["Content-Type"] = "application/json"
            return response

    try:
        insert_new_phone_number(database, person_id, ph_number, mobile_network_operator_obj)
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "Phone number already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The phone number has been added successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

"""
handler for applying a filter over the contacts so that the data is filtered
"""
def read_contacts_paginated_filtered_handler(database, page_id, name, mobile_network_operator, phone_number, group_id):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contacts_page_filtered(%s, %s, %s, %s, %s);", (name, mobile_network_operator, phone_number, group_id, page_id * 10))
    query_result = database_cursor.fetchall()
    print(query_result)

    contact_list = extract_filtered_contacts_list(query_result)

    result = {"contacts": contact_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
returns the number of contacts filtered
"""
def read_contacts_paginated_filtered_count_handler(database, name, mobile_network_operator, phone_number, group_id):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_contacts_page_filtered_count(%s, %s, %s, %s);", (name, mobile_network_operator, phone_number, group_id))
    query_result = database_cursor.fetchall()

    contacts_count = query_result[0][0]

    result = {"contact": contacts_count}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
function for deleting a contacs
"""
def delete_contact_function(database, contact_id):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL delete_contact(%s);", (contact_id,))
        database.instance.commit()

        return

"""
handler for deleting a contact
"""
def delete_contact_handler(database, contact_id):
    try:
        delete_contact_function(database, contact_id)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The contact has been deleted successfully."}
    response = make_response(message, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
function for deleting a phone number
"""
def delete_phone_number_function(database, phone_number_id):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL delete_phone_number(%s);", (phone_number_id,))
        database.instance.commit()

        return

"""
handler for deleting a phone number
"""
def delete_phone_number_handler(database, phone_number_id):
    try:
        delete_phone_number_function(database, phone_number_id)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The phone number has been deleted successfully."}
    response = make_response(message, OK)
    response.headers["Content-Type"] = "application/json"
    return response

"""
function for updating a contact
"""
def update_contact_function(database, contact_id, first_name, last_name):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL update_contact(%s, %s, %s);", (contact_id, first_name, last_name))
        database.instance.commit()

        return

"""
handler for updating a contact
"""
def update_contact_handler(database, contact_id, body):
    if (check_update_contact_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    contact_cmd = json.loads(body)
    
    if (check_update_contact_valid_json(contact_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response

    print(contact_cmd)

    first_name = None
    if contact_cmd['firstName'] != '':
        first_name = contact_cmd['firstName']
    
    last_name = None
    if contact_cmd['lastName'] != '':
        last_name = contact_cmd['lastName']

    try:
        update_contact_function(database, contact_id, first_name, last_name)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The person has been edited successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response