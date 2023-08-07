class GroupsDto:
    def __init__(self, id, name, size):
        self.id = int(id)
        self.name = name
        self.size = size

    def getDictionary(self):
        groupsDict = {}
        groupsDict['id'] = self.id
        groupsDict['name'] = self.name 
        groupsDict['size'] = self.size

        return groupsDict
    
class SingleGroupDto:
    def __init__(self, id, name):
        self.id = int(id)
        self.name = name
        self.members = []  

    def getDictionary(self):
        groupDict = {}
        groupDict['id'] = self.id
        groupDict['name'] = self.name 
        groupDict['members'] = []

        for member in self.members:
            memberDict = {}
            memberDict['id'] = member.id
            memberDict['name'] = member.name
            groupDict['members'].append(memberDict)

        return groupDict
    
class MemberDto:
    def __init__(self, id, first_name, last_name):
        self.id = int(id)
        self.name = first_name + ' ' + last_name