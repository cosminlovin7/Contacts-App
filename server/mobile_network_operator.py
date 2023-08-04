class MobileNetworkOperator:
    def __init__(self, id, operator_number, operator_name):
        self.id = id
        self.operator_number = operator_number
        self.operator_name = operator_name

    def __str__(self):
        # Generate a string representation of the class instance
        return f"MobileNetworkOperator(id={self.id}, operator_number={self.operator_number}, operator_name={self.operator_name})"