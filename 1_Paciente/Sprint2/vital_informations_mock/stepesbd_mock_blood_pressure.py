import requests
import time
import random
person = input("Insira o número SUS do paciente: ")

while (True):
    time.sleep(2)
    systolic = random.randint(70,210)
    diastolic = random.randint(40, 140)
    url_string = 'http://stepesbd.ddns.net:8086/write?db=vital_signs'
    #url_string = 'http://localhost:8086/write?db=vital_signs'
    data_string = 'blood_pressure,person='+person+' systolic='+str(systolic)+',diastolic='+str(diastolic)

    r = requests.post(url_string, data=data_string)
