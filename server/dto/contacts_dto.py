class PhoneNumberDto:
    def __init__(self, id, number):
        self.id = int(id)
        self.number = number

class GroupDto:
    def __init__(self, id, name):
        self.id = int(id)
        self.name = name

class ContactsDto:
    def __init__(self, id, first_name, last_name):
        self.id = int(id)
        self.name = first_name + ' ' + last_name

    def getDictionary(self):
        contactsDict = {}

        contactsDict['id'] = self.id
        contactsDict['name'] = self.name

        return contactsDict

class FilteredContactsDto:
    def __init__(self, id, first_name, last_name, phone_number_id, phone_number, group_id, group_name, operator_name, operator_number):
        self.id = int(id)
        self.name = first_name + ' ' + last_name
        phoneNumberDto = None
        if (phone_number_id != '' and phone_number != ''):
            phoneNumberDto = PhoneNumberDto(phone_number_id, operator_number + phone_number)
        self.phoneNumber = phoneNumberDto
        groupDto = None
        if (group_id != ''):
            groupDto = GroupDto(group_id, group_name)
        self.group = groupDto
        self.operatorName = operator_name

    def getDictionary(self):
        contactsDict = {}
        phoneNumberDict = None
        groupDict = None

        contactsDict['id'] = self.id
        contactsDict['name'] = self.name

        if (self.phoneNumber is not None):
            phoneNumberDict = {}
            phoneNumberDict['id'] = self.phoneNumber.id
            phoneNumberDict['number'] = self.phoneNumber.number

        if (self.group is not None):
            groupDict = {}
            groupDict['id'] = self.group.id
            groupDict['name'] = self.group.name

        contactsDict['phoneNumber'] = phoneNumberDict
        contactsDict['group'] = groupDict
        contactsDict['operatorName'] = self.operatorName

        return contactsDict
        
class SinglePhoneNumberDto:
    def __init__(self, phone_id, phone_number, operator_name, operator_number):
        self.id = int(phone_id)
        self.number = operator_number + phone_number
        self.operator_name = operator_name

class SingleContactDto:
    def __init__(self, id, first_name, last_name):
        self.id = int(id)
        self.name = first_name + ' ' + last_name
        self.phone_numbers = []
        self.groups = []

    def getDictionary(self):
        singleContactDict = {}

        singleContactDict['id'] = self.id
        singleContactDict['name'] = self.name
        singleContactDict['phoneNumbers'] = []
        singleContactDict['groups'] = []

        for phone_number in self.phone_numbers:
            phoneNumberDict = {}
            phoneNumberDict['id'] = phone_number.id
            phoneNumberDict['number'] = phone_number.number
            phoneNumberDict['operatorName'] = phone_number.operator_name
            singleContactDict['phoneNumbers'].append(phoneNumberDict)

        for group in self.groups:
            groupDict = {}
            groupDict['id'] = group.id
            groupDict['name'] = group.name
            singleContactDict['groups'].append(groupDict)

        return singleContactDict