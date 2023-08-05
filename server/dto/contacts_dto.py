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
        
class SinglePhoneNumberDto:
    def __init__(self, phone_id, phone_number, operator_name, operator_number):
        self.id = phone_id
        self.number = operator_number + phone_number
        self.operator_name = operator_name

class SingleContactDto:
    def __init__(self, id, first_name, last_name):
        self.id = id
        self.name = first_name + ' ' + last_name
        self.phone_numbers = []

    def getDictionary(self):
        singleContactDict = {}

        singleContactDict['id'] = self.id
        singleContactDict['name'] = self.name
        singleContactDict['phoneNumbers'] = []

        for phone_number in self.phone_numbers:
            phoneNumberDict = {}
            phoneNumberDict['id'] = phone_number.id
            phoneNumberDict['number'] = phone_number.number
            phoneNumberDict['operatorName'] = phone_number.operator_name
            singleContactDict['phoneNumbers'].append(phoneNumberDict)

        return singleContactDict