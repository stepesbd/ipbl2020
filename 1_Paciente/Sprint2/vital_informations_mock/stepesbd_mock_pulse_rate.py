import requests
import time
import random
person = input("Insira o número SUS do paciente: ")

while (True):
    time.sleep(2)
    pulse = random.randint(70,100)
    url_string = 'http://stepesbd.ddns.net:8086/write?db=vital_signs'
    #url_string = 'http://localhost:8086/write?db=vital_signs'
    data_string = 'pulse_rate,person='+person+' value='+str(pulse)

    r = requests.post(url_string, data=data_string)
