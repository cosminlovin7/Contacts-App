class PhoneNumber:
    def __init__(self, id, phone_number, mob_net_operator_id):
        self.id = id
        self.phone_number = phone_number
        self.mob_net_operator_id = mob_net_operator_id

    def __str__(self):
        # Generate a string representation of the class instance
        return f"PhoneNumber(id={self.id}, phone_number={self.phone_number}, mob_net_operator_id={self.mob_net_operator_id})"