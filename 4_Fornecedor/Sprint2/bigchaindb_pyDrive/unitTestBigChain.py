from assetManipulation import assetManipulation
import colorama
from colorama import Fore, Back, Style

mask_asset = {
    'data': {
        'Product': {
            'Description': 'EPI mask',
            'Type':'1',
            'Part_number':'01234567',
            'Manufacturer': 'Joaozinho.inc'
        },
    },
}

mask_asset_metadata = {
    'product': 'EPI mask'
}

newConnection = assetManipulation('http://35.247.236.106:9984')

assetId = newConnection.getAsset('Joaozinho','EPI gloves')

if assetId == None:
	print(f"{Fore.BLACK}{Back.GREEN}pass the test!{Style.RESET_ALL}")
else:
	print(f"{Back.RED}test failed!{Style.RESET_ALL}")

assetId = newConnection.getAsset('Joaozinho','EPI mask')

if assetId == None:
	print(f"{Fore.BLACK}{Back.YELLOW}First pass, create test block!{Style.RESET_ALL}")
	newConnection.createAsset(mask_asset, mask_asset_metadata, 'Joaozinho', 500)
else:
	print(f"{Fore.BLACK}{Back.YELLOW}test block already created!{Style.RESET_ALL}")

transferId = newConnection.getLastTransfer(assetId)

if transferId != None:
	print(f"{Fore.BLACK}{Back.GREEN}pass the test!{Style.RESET_ALL}")
	print(f"{Fore.BLACK}{Back.GREEN}Block id{Style.RESET_ALL}")
	print(transferId)
else:
	print(f"{Back.RED}test failed!{Style.RESET_ALL}")

transferStatus = newConnection.transferAsset( transferId, 'Joaozinho', 'Maria', 100)

if transferStatus != False:
	print(f"{Fore.BLACK}{Back.GREEN}pass the test!{Style.RESET_ALL}")
else:
	print(f"{Back.RED}test failed!{Style.RESET_ALL}")

transferId = newConnection.getLastTransfer(assetId)

if transferId != None:
	print(f"{Fore.BLACK}{Back.GREEN}pass the test!{Style.RESET_ALL}")
	print(f"{Fore.BLACK}{Back.GREEN}Block id{Style.RESET_ALL}")
	print(transferId)
else:
	print(f"{Back.RED}test failed!{Style.RESET_ALL}")

transferStatus = newConnection.transferAsset( transferId, 'Maria', 'Joaozinho', 100)

if transferStatus != False:
	print(f"{Fore.BLACK}{Back.GREEN}pass the test!{Style.RESET_ALL}")
else:
	print(f"{Back.RED}test failed!{Style.RESET_ALL}")