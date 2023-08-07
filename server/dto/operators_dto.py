class OperatorsDto:
    def __init__(self, id, name, prefix):
        self.id = int(id)
        self.name = name
        self.prefix = prefix

    def getDictionary(self):
        operatorsDict = {}
        operatorsDict['id'] = self.id
        operatorsDict['name'] = self.name 
        operatorsDict['prefix'] = self.prefix

        return operatorsDict