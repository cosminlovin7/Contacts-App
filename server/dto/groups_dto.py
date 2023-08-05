class GroupsDto:
    def __init__(self, id, name, size):
        self.id = id
        self.name = name
        self.size = size

    def getDictionary(self):
        groupsDict = {}
        groupsDict['id'] = self.id
        groupsDict['name'] = self.name 
        groupsDict['size'] = self.size

        return groupsDict