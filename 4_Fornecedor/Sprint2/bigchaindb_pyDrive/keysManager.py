from bigchaindb_driver.crypto import generate_keypair
import json
import os.path
from os import path

# Get the keys from owners. If the owner do not exists, gererate a new pair of keys
# and save it into a file.
class keysManager:

    def __init__(self):
        self.public_key = None
        self.private_key = None

    def getOwnerKeys(self, ownerName ):
# Check if the file already have been created
        if path.exists('ownerKeys.txt') == False:
            data = {}
            data['ownerKeys'] = []
            with open('ownerKeys.txt', 'w+') as outfile:
                json.dump(data, outfile)
                outfile.close()

# Search, by the name, if there is a pair of keys already
        with open('ownerKeys.txt', 'r') as json_file:
            data = json.load(json_file)
            find = False
            for obj in data['ownerKeys']:
                if obj['name'] == ownerName:
                    self.public_key = obj['public_key']
                    self.private_key = obj['private_key']
                    find = True

# Else generate a new pair and save for forthcomming consult
        if find == False:
            with open('ownerKeys.txt', 'w') as outfile:
                ownerKeys = generate_keypair()

                data['ownerKeys'].append({
                    'name': ownerName,
                    'public_key': ownerKeys.public_key,
                    'private_key': ownerKeys.private_key
                })
                json.dump(data, outfile)

                self.public_key = ownerKeys.public_key
                self.private_key = ownerKeys.private_key
            
            outfile.close()
        
        json_file.close()

# Example of use 
#keys = keysManager()
#keys.getOwnerKeys("Victor")

#print(keys.public_key)
#print(keys.private_key)