from flask import Flask, make_response, request
import json
import psycopg2
from dto.groups_dto import GroupsDto, SingleGroupDto, MemberDto
from constants import *

def check_group_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    if (("name" not in body_dict)):
        return False
    
    if (isinstance(body_dict["name"], str) == False):
        return False

    return True

"""
verify the validity of the values received in the request body
"""
def check_group_valid_json(group_cmd):
    if (len(group_cmd['name']) > 50):
        return False
    
    return True

def check_contact_to_group_json(body):
    try:
        body_dict = json.loads(body)
    except ValueError as e:
        return False

    print(type(body_dict['groupId']))

    if (("groupId" not in body_dict)):
        return False

    if (isinstance(body_dict["groupId"], int) == False):
        return False

    return True

def extract_groups_list(query_result):
    list = []
    for row in query_result:
        elements = row[0].strip('()').split(',')
        group_obj = GroupsDto(elements[0], elements[1], elements[2])
        list.append(group_obj.getDictionary())

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
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    group_cmd = json.loads(body)

    if (check_group_valid_json(group_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    print(group_cmd)

    try: 
        insert_group_function(database, group_cmd['name'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "Group already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The group has been saved successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

def insert_contact_to_group_function(database, contact_id, group_id):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL insert_contact_into_group(%s, %s);", (contact_id, group_id))
        database.instance.commit()

        return

def insert_contact_to_group_handler(database, contact_id, body):
    if (check_contact_to_group_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    contact_to_group = json.loads(body)

    print(contact_to_group)

    try: 
        insert_contact_to_group_function(database, contact_id, contact_to_group['groupId'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "The contact is already in the group."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The contact has been successfully added to the group."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response

def delete_contact_from_group_function(database, contact_id, group_id):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL delete_contact_from_group(%s, %s);", (contact_id, group_id))
        database.instance.commit()

        return

def delete_contact_from_group_handler(database, contact_id, group_id):
    try: 
        delete_contact_from_group_function(database, contact_id, group_id)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "You have succesfully exited the the group."}
    response = make_response(message, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def extract_group(query_result):
    group_obj = None
    if (len(query_result) > 0):
        elements = query_result[0].strip('()').split(',')
        group_obj = SingleGroupDto(elements[0], elements[1])

    return group_obj

def extract_group_members(group_obj, query_result):
    for row in query_result:
        elements = row[0].strip('()').split(',')
        phone_number_obj = MemberDto(elements[0], elements[1], elements[2])
        group_obj.members.append(phone_number_obj)

def read_group_handler(database, group_id):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT read_group(%s);", (group_id,))
    query_result = database_cursor.fetchone()

    group_obj = None
    if (query_result is not None):
        group_obj = extract_group(query_result)

    if (group_obj is None):
        result = {"message": "The contact was not found."}
        response = make_response(result, NOT_FOUND)
        response.headers["Content-Type"] = "application/json"
        return response

    database_cursor.execute("SELECT read_group_members(%s);", (group_id,))
    query_result = database_cursor.fetchall()
    if (query_result is not None):
        extract_group_members(group_obj, query_result)

    result = {"group": group_obj.getDictionary()}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def delete_group_function(database, group_id):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL delete_group(%s);", (group_id,))
        database.instance.commit()

        return

def delete_group_handler(database, group_id):
    database_cursor = database.instance.cursor()

    database_cursor.execute("SELECT calculate_group_size(%s);", (group_id,))
    query_result = database_cursor.fetchall()
    group_size = query_result[0][0]

    if (group_size > 0):
        result = {"message": "The group has members."}
        response = make_response(result, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response

    try:
        delete_group_function(database, group_id)
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    result = {"message": "The group has been deleted successfully."}
    response = make_response(result, OK)
    response.headers["Content-Type"] = "application/json"
    return response

def update_group_function(database, group_id, group_name):
    with database.instance.cursor() as cursor:
        cursor.execute("CALL update_group(%s, %s);", (group_id, group_name))
        database.instance.commit()

        return

def update_group_handler(database, group_id, body):
    if (check_group_json(body) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    group_cmd = json.loads(body)

    if (check_group_valid_json(group_cmd) == False):
        error_message = {"message": "HTTP Error 400 Bad Request"}
        response = make_response(error_message, BAD_REQUEST)
        response.headers["Content-Type"] = "application/json"
        return response
    
    print(group_cmd)

    try: 
        update_group_function(database, group_id, group_cmd['name'])
    except psycopg2.IntegrityError as e:
        database.instance.rollback()
        error_message = {"message": "Group already exists."}
        response = make_response(error_message, CONFLICT)
        response.headers["Content-Type"] = "application/json"
        return response
    except Exception as e:
        database.instance.rollback()
        error_message = {"message": "An unexpected error occurred."}
        response = make_response(error_message, INTERNAL_ERROR)
        response.headers["Content-Type"] = "application/json"
        return response

    message = {"message": "The group has been edited successfully."}
    response = make_response(message, CREATED)
    response.headers["Content-Type"] = "application/json"
    return response