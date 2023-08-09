CREATE TABLE IF NOT EXISTS MOBILE_NETWORK_OPERATORS (
    id SERIAL PRIMARY KEY,
    operator_number VARCHAR(3) UNIQUE NOT NULL, 
    operator_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS PHONE_NUMBERS (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(7) NOT NULL,
    mob_net_operator_id INTEGER NOT NULL,
    CONSTRAINT uq_phone_number UNIQUE (phone_number, mob_net_operator_id),
    CONSTRAINT fk_mob_net_operator
        FOREIGN KEY(mob_net_operator_id)
        REFERENCES MOBILE_NETWORK_OPERATORS(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PERSONS (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS PERSONS_PHONE_NUMBERS (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    phone_number_id INTEGER NOT NULL,
    CONSTRAINT uq_persons_phone_numbers UNIQUE (person_id, phone_number_id),
    CONSTRAINT fk_person
        FOREIGN KEY (person_id)
        REFERENCES PERSONS(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_phone_number
        FOREIGN KEY (phone_number_id)
        REFERENCES PHONE_NUMBERS(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS GROUPS (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS GROUP_MEMBERS (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    CONSTRAINT uq_group_members UNIQUE (person_id, group_id),
    CONSTRAINT fk_person
        FOREIGN KEY (person_id)
        REFERENCES PERSONS(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_group
        FOREIGN KEY (group_id)
        REFERENCES GROUPS(id)
        ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION insert_phone_number(ph_number TEXT, mobile_operator_id INTEGER)
RETURNS phone_numbers AS
$$
DECLARE
    inserted_row phone_numbers;
BEGIN
    INSERT INTO phone_numbers (phone_number, mob_net_operator_id)
    VALUES (ph_number, mobile_operator_id)
    RETURNING * INTO inserted_row;
    
    RETURN inserted_row;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_one_mobile_operator_by_operator_number(operator_prefix VARCHAR)
RETURNS SETOF mobile_network_operators AS
$$
BEGIN
    RETURN QUERY SELECT * FROM mobile_network_operators 
				 WHERE operator_number = operator_prefix
                 LIMIT 1;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_person(p_first_name VARCHAR, p_last_name VARCHAR, p_phone_number_id INTEGER)
RETURNS persons AS
$$
DECLARE
    inserted_person persons;
BEGIN
    INSERT INTO persons (first_name, last_name)
    VALUES (p_first_name, p_last_name)
    RETURNING * INTO inserted_person;
    
    INSERT INTO persons_phone_numbers (person_id, phone_number_id)
    VALUES (inserted_person.id, p_phone_number_id);

    RETURN inserted_person;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_phone_number_to_person(person_id INTEGER, ph_number VARCHAR, mobile_network_operator_id INTEGER)
AS 
$$
DECLARE 
    inserted_phone_number phone_numbers;
BEGIN
    INSERT INTO phone_numbers (phone_number, mob_net_operator_id) 
    VALUES (ph_number, mobile_network_operator_id)
    RETURNING * INTO inserted_phone_number;

    INSERT INTO persons_phone_numbers (person_id, phone_number_id)
    VALUES (person_id, inserted_phone_number.id);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contacts()
RETURNS TABLE (id INTEGER, first_name VARCHAR, last_name VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT p.id, p.first_name, p.last_name FROM persons p ORDER BY p.first_name;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_mobile_network_operator_without_operator_name(op_number VARCHAR)
RETURNS mobile_network_operators AS
$$
DECLARE
    inserted_operator mobile_network_operators;
BEGIN
    INSERT INTO mobile_network_operators (operator_number)
    VALUES (op_number)
    RETURNING * INTO inserted_operator;

    return inserted_operator;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contacts_page(page_number INTEGER)
RETURNS TABLE (id INTEGER, first_name VARCHAR, last_name VARCHAR, phone_number_id INTEGER, phone_number VARCHAR, group_id INTEGER, group_name VARCHAR, operator_name VARCHAR, operator_number VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT p.id, p.first_name, p.last_name, pn.id, pn.phone_number, g.id, g.group_name, op.operator_name, op.operator_number FROM persons p
                LEFT JOIN persons_phone_numbers ppn ON p.id = ppn.person_id
                LEFT JOIN phone_numbers pn ON ppn.phone_number_id = pn.id
                LEFT JOIN mobile_network_operators op ON pn.mob_net_operator_id = op.id
                LEFT JOIN group_members gm ON p.id = gm.person_id
                LEFT JOIN groups g on gm.group_id = g.id
                LIMIT 10 OFFSET page_number;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contacts_count()
RETURNS SETOF bigint AS
$$
BEGIN
    RETURN QUERY SELECT count(*) as count_result FROM persons p
                LEFT JOIN persons_phone_numbers ppn ON p.id = ppn.person_id
                LEFT JOIN phone_numbers pn ON ppn.phone_number_id = pn.id
                LEFT JOIN mobile_network_operators op ON pn.mob_net_operator_id = op.id
                LEFT JOIN group_members gm ON p.id = gm.person_id
                LEFT JOIN groups g on gm.group_id = g.id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contacts_page_filtered(f_name VARCHAR, f_operator_name VARCHAR, f_phone_number VARCHAR, f_group_name VARCHAR, page_number INTEGER)
RETURNS TABLE (id INTEGER, first_name VARCHAR, last_name VARCHAR, phone_number_id INTEGER, phone_number VARCHAR, group_id INTEGER, group_name VARCHAR, operator_name VARCHAR, operator_number VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT p.id, p.first_name, p.last_name, pn.id, pn.phone_number, g.id, g.group_name, op.operator_name, op.operator_number FROM persons p
                LEFT JOIN persons_phone_numbers ppn ON p.id = ppn.person_id
                LEFT JOIN phone_numbers pn ON ppn.phone_number_id = pn.id
                LEFT JOIN mobile_network_operators op ON pn.mob_net_operator_id = op.id
                LEFT JOIN group_members gm ON p.id = gm.person_id
                LEFT JOIN groups g on gm.group_id = g.id
                WHERE (f_name is null OR concat(concat(p.first_name, ' '),p.last_name) LIKE concat(concat('%', f_name), '%')) AND
                      (f_phone_number is null OR concat(op.operator_number, pn.phone_number) LIKE concat(concat('%', f_phone_number), '%')) AND
                      (f_operator_name is null OR op.operator_name LIKE concat(concat('%', f_operator_name), '%')) AND
                      (f_group_name is null OR g.group_name = f_group_name)
                LIMIT 10 OFFSET page_number;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contacts_page_filtered_count(f_name VARCHAR, f_operator_name VARCHAR, f_phone_number VARCHAR, f_group_name VARCHAR)
RETURNS SETOF bigint AS
$$
BEGIN
    RETURN QUERY SELECT count(*) as count_result FROM persons p
                LEFT JOIN persons_phone_numbers ppn ON p.id = ppn.person_id
                LEFT JOIN phone_numbers pn ON ppn.phone_number_id = pn.id
                LEFT JOIN mobile_network_operators op ON pn.mob_net_operator_id = op.id
                LEFT JOIN group_members gm ON p.id = gm.person_id
                LEFT JOIN groups g on gm.group_id = g.id
                WHERE (f_name is null OR concat(concat(p.first_name, ' '),p.last_name) LIKE concat(concat('%', f_name), '%')) AND
                      (f_phone_number is null OR concat(op.operator_number, pn.phone_number) LIKE concat(concat('%', f_phone_number), '%')) AND
                      (f_operator_name is null OR op.operator_name LIKE concat(concat('%', f_operator_name), '%')) AND
                      (f_group_name is null OR g.group_name = f_group_name);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contact(contact_id INTEGER)
RETURNS TABLE (id INTEGER, first_name VARCHAR, last_name VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT p.id, p.first_name, p.last_name FROM persons p
                WHERE p.id = contact_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_groups()
RETURNS TABLE (id INTEGER, name VARCHAR, size bigint) AS
$$
BEGIN
    RETURN QUERY SELECT g.id, g.group_name, count(gm.id) as size FROM groups g LEFT JOIN group_members gm ON g.id = gm.group_id GROUP BY g.id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_contact(contact_id INTEGER)
AS
$$
BEGIN
    DELETE FROM phone_numbers pn USING persons_phone_numbers ppn
	WHERE pn.id = ppn.phone_number_id
 	AND ppn.person_id = contact_id;
	
	DELETE FROM persons WHERE id = contact_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_phone_number(phone_number_id INTEGER)
AS
$$
BEGIN
    DELETE FROM phone_numbers pn where pn.id = phone_number_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_phone_number_to_person(name VARCHAR)
AS 
$$
BEGIN
    INSERT INTO groups (group_name) VALUES (name);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_group(name VARCHAR)
AS 
$$
BEGIN
    INSERT INTO groups (group_name) VALUES (name);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_contact_into_group(c_id INTEGER, g_id INTEGER)
AS
$$
BEGIN
    INSERT INTO group_members(person_id, group_id) VALUES(c_id, g_id);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contact_phone_numbers(c_id INTEGER)
RETURNS TABLE(id INTEGER, phone_number VARCHAR, operator_name VARCHAR, operator_number VARCHAR) AS 
$$
BEGIN
    RETURN QUERY SELECT pn.id, pn.phone_number, mno.operator_name, mno.operator_number FROM phone_numbers pn 
        JOIN mobile_network_operators mno ON pn.mob_net_operator_id = mno.id
        JOIN persons_phone_numbers ppn ON ppn.phone_number_id = pn.id
        WHERE ppn.person_id = c_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_contact_groups(c_id INTEGER)
RETURNS TABLE(id INTEGER, group_name VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT g.id, g.group_name FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.person_id = c_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_contact_from_group(c_id INTEGER, g_id INTEGER)
AS
$$
BEGIN
    DELETE FROM group_members gm where gm.person_id = c_id AND gm.group_id = g_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_group(g_id INTEGER)
RETURNS TABLE(id INTEGER, group_name VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT g.id, g.group_name FROM groups g WHERE g.id = g_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_group_members(g_id INTEGER)
RETURNS TABLE (id INTEGER, first_name VARCHAR, last_name VARCHAR) AS
$$
BEGIN
    RETURN QUERY SELECT p.id, p.first_name, p.last_name FROM persons p 
                JOIN group_members gm ON gm.person_id = p.id
                WHERE gm.group_id = g_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_group_size(g_id INTEGER)
RETURNS SETOF bigint AS
$$
BEGIN
    RETURN QUERY SELECT count(*) FROM group_members gm WHERE gm.group_id = g_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_group(g_id INTEGER)
AS
$$
BEGIN
    DELETE FROM groups g WHERE g.id = g_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_operators()
RETURNS TABLE(id INTEGER, name VARCHAR, prefix VARCHAR)
AS
$$
BEGIN
    RETURN QUERY SELECT o.id, o.operator_name, o.operator_number FROM mobile_network_operators o ORDER BY o.operator_name;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_operator(op_id INTEGER)
RETURNS TABLE(id INTEGER, name VARCHAR, prefix VARCHAR)
AS
$$
BEGIN
    RETURN QUERY SELECT o.id, o.operator_name, o.operator_number FROM mobile_network_operators o WHERE o.id = op_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_operator(op_name VARCHAR, op_prefix VARCHAR)
AS
$$
BEGIN
    INSERT INTO mobile_network_operators(operator_name, operator_number) VALUES(op_name, op_prefix);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_operator(op_id INTEGER, op_name VARCHAR, op_prefix VARCHAR)
AS
$$
BEGIN
    UPDATE mobile_network_operators SET operator_name = op_name, operator_number = op_prefix WHERE id = op_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_contact(c_id INTEGER, c_first_name VARCHAR, c_last_name VARCHAR)
AS
$$
BEGIN
    UPDATE persons SET first_name = c_first_name, last_name = c_last_name WHERE id = c_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_group(g_id INTEGER, g_name VARCHAR)
AS
$$
BEGIN
    UPDATE groups SET group_name = g_name WHERE id = g_id;
END;
$$
LANGUAGE plpgsql;