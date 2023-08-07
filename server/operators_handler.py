from flask import Flask, make_response, request
import json
import psycopg2
from dto.operators_dto import OperatorsDto
from constants import *

def check_operator_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if (("name" not in body_dict) | ("prefix" not in body_dict)):
        return False

    if ((isinstance(body_dict["name"], str) == False) 
        | (isinstance(body_dict["prefix"], str) == False)):
        return False

    return True

"""
verify the validity of the values received in the request body
"""
def check_operator_valid_json(operator_cmd):
    if (len(operator_cmd['name']) > 50):
        return False
    
    if (len(operator_cmd['prefix']) != 3):
        return False
    
    return True

def extract_operator(query_result):
    operator_obj = None
    if (len(query_result) > 0):
        elements = query_result[0].strip('()').split(',')
        operator_obj = OperatorsDto(elements[0], elements[1], elements[2])

    return operator_obj

def extract_operators_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        operator_obj = OperatorsDto(elements[0], elements[1], elements[2])
        list.append(operator_obj.getDictionary())

    return list

def read_operators_handler(database):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_operators();", ())
    query_result = database_cursor.fetchall()

    operators_list = extract_operators_list(query_result)

    result = {"operators": operators_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def insert_operator_function(database, operator_name, operator_number):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL insert_operator(%s, %s);", (operator_name, operator_number))
        database.instance.commit()

        return

def insert_operator_handler(database, body):
    if (check_operator_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    operator_cmd = json.loads(body)

    if (check_operator_valid_json(operator_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response

    try: 
        insert_operator_function(database, operator_cmd['name'], operator_cmd['prefix'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "The operator prefix already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response
    
    message = {"message": "The operator has been successfully created."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

def update_operator_function(database, operator_id, operator_name, operator_number):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL update_operator(%s, %s, %s);", (operator_id, operator_name, operator_number))
        database.instance.commit()

        return

def update_operator_handler(database, operator_id, body):
    if (check_operator_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    operator_cmd = json.loads(body)

    if (check_operator_valid_json(operator_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    try: 
        update_operator_function(database, operator_id, operator_cmd['name'], operator_cmd['prefix'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "The operator prefix already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response
    
    message = {"message": "The operator has been successfully modified."}
    response = make_response(message, OK)
    response.headers["Content-Type"] = "application/json"
    return response
    

