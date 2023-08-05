from flask import Flask, make_response, request
import json
import psycopg2
from dto.groups_dto import GroupsDto
from constants import *

def check_group_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if (("name" not in body_dict)):
        return False
    
    return True

"""
verify the validity of the values received in the request body
"""
def check_group_valid_json(group_cmd):
    if (len(group_cmd['name']) > 50):
        return False
    
    return True

def extract_groups_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        contact_obj = GroupsDto(elements[0], elements[1], elements[2])
        list.append(contact_obj.getDictionary())

    return list

def read_groups_handler(database):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_groups();", ())
    query_result = database_cursor.fetchall()

    groups_list = extract_groups_list(query_result)

    result = {"groups": groups_list}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def insert_group_function(database, group_name):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL insert_group(%s);", (group_name,))
        database.instance.commit()

        return

def insert_group_handler(database, body):
    if (check_group_json(body) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    group_cmd = json.loads(body)

    if (check_group_valid_json(group_cmd) == False):
        error_message = {"error": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    print(group_cmd)

    try: 
        insert_group_function(database, group_cmd['name'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"error": "Group already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"error": "An unexpected error occurred.", "type": e}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The group has been saved successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response