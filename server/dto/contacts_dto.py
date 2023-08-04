class PhoneNumberDto:
    def __init__(self, id, number):
        self.id = id
        self.number = number

class ContactsDto:
    def __init__(self, id, first_name, last_name, phone_number_id, phone_number, operator_name, operator_number):
        self.id = id
        self.name = first_name + ' ' + last_name
        self.phoneNumber = PhoneNumberDto(phone_number_id, operator_number + phone_number)
        self.operatorName = operator_name

    def getDictionary(self):
        contactsDict = {}
        phoneNumberDict = {}

        contactsDict['id'] = self.id
        contactsDict['name'] = self.name

        phoneNumberDict['id'] = self.phoneNumber.id
        phoneNumberDict['number'] = self.phoneNumber.number

        contactsDict['phoneNumber'] = phoneNumberDict
        contactsDict['operatorName'] = self.operatorName

        return contactsDict
        