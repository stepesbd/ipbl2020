from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from time import sleep
from sys import exit
import json
from keysManager import keysManager

class assetManipulation:
# Connect to the bigcahin URL when the object is created.
    def __init__( self, bigchainUrl ):
#        self.bigchainUrl = 'https://example.com:9984'  # Use YOUR BigchainDB Root URL here
        self.dataBase = BigchainDB(bigchainUrl)
#        print(bigchainUrl)

# Generate a new asset block and transfer it to the first owner.
    def createAsset( self, blockAsset, blockMetadata, ownerName, quantity ):
        ownerKeys = keysManager()
        ownerKeys.getOwnerKeys(ownerName)

        prepared_creation_tx = self.dataBase.transactions.prepare(
            operation='CREATE',
            signers=ownerKeys.public_key,
            recipients=[([ownerKeys.public_key], quantity)],
            asset=blockAsset,
            metadata=blockMetadata
        )

        fulfilled_creation_tx = self.dataBase.transactions.fulfill(
            prepared_creation_tx,
            private_keys=ownerKeys.private_key
        )

        sent_creation_tx = self.dataBase.transactions.send_commit(fulfilled_creation_tx)

        transactionId = fulfilled_creation_tx['id']
        
        print("Created block:")
        print(fulfilled_creation_tx)
        print(transactionId)

        return transactionId

# Get an asset block id by description
    def getAsset( self, ownerName, description ):
        result = self.dataBase.assets.get(search=ownerName)
        assetId = 0
        for obj in result:
            print(obj)
            if obj['data']['product']['description'] == description:
                assetId = obj['id']

        if assetId != 0:
            block_height = self.dataBase.blocks.get(txid=assetId)
            if block_height != None:
                block = self.dataBase.blocks.retrieve(str(block_height))

                transfer_asset = {
                    'id': assetId
                }

                output_index = 0
                print("finded block:")
                print(block)
                return assetId
            else:
                return None
        else:
            print("Didn't find any block with this description!")
            return None

# Get an asset transfer id by block id
    def getLastTransfer( self, blockId ):
        result = self.dataBase.transactions.get(asset_id=blockId)
        assetId = 0
        for obj in result:
            assetId = obj['id']

        if assetId != 0:
            block_height = self.dataBase.blocks.get(txid=assetId)
            if block_height != None:
                block = self.dataBase.blocks.retrieve(str(block_height))

                transfer_asset = {
                    'id': assetId
                }

                output_index = 0
                print("finded block:")
                print(block)
                return assetId
            else:
                return None
        else:
            print("Didn't find any block with this description!")
            return None

# Transfer an asset block to another one
    def transferAsset( self, assetId, ownerName, destinationName, quantity ):
        block_height = self.dataBase.blocks.get(txid=assetId)
        if block_height != None:
            block = self.dataBase.blocks.retrieve(str(block_height))

            ownerKeys = keysManager()
            ownerKeys.getOwnerKeys(ownerName)

            destinationKeys = keysManager()
            destinationKeys.getOwnerKeys(destinationName)
            
            output_index = -1

            for index, obj in enumerate(block['transactions'][0]['outputs']):
                if obj['public_keys'][0] == ownerKeys.public_key:
                    output_index = index
                    quantityOwner = obj['amount']
            
            if output_index == -1:
                return False

            print(obj['amount'])
            print(output_index)

            creation_tx = block['transactions'][0]

            output = creation_tx['outputs'][output_index]

            transfer_input = {
                'fulfillment': output['condition']['details'],
                'fulfills': {
                    'output_index': output_index,
                    'transaction_id': creation_tx['id'],
                },
                'owners_before': output['public_keys'],
            }

            if creation_tx['operation'] == 'CREATE':
                transfer_asset = {
                    'id': creation_tx['id'],
                }
            else:
                transfer_asset = {
                    'id': creation_tx['asset']['id'],
                }

            if (int(quantityOwner)-int(quantity)) == 0: 
                prepared_transfer_tx = self.dataBase.transactions.prepare(
                    operation='TRANSFER',
                    asset=transfer_asset,
                    inputs=transfer_input,
                    recipients=[([destinationKeys.public_key], quantity)]
                )
            else:
                prepared_transfer_tx = self.dataBase.transactions.prepare(
                    operation='TRANSFER',
                    asset=transfer_asset,
                    inputs=transfer_input,
                    recipients=[([destinationKeys.public_key], quantity), ([ownerKeys.public_key], (int(quantityOwner)-int(quantity)))]
                )

            fulfilled_transfer_tx = self.dataBase.transactions.fulfill(
                prepared_transfer_tx, private_keys=ownerKeys.private_key)
            
            try:
                sent_transfer_tx = self.dataBase.transactions.send_commit(fulfilled_transfer_tx)
            except:
                sent_transfer_tx = False

            return sent_transfer_tx
        else:
            return False