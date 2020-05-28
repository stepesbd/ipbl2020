import requests
import time
import random

person = input("Insira o número SUS do paciente: ")

#level: [cicles, min_temp, max_temp]
map_temperature = {'normal': [300, 36.0, 37.3],
                   'low': [60, 36.8, 38.3],
                   'medium': [180, 37.8, 39.3],
                   'high': [360, 38.8, 40.0]}

now_level = 'normal'

cicle_range_normal = {'min': 0, 'max': map_temperature['normal'][0]}
cicle_range_low = {'min': cicle_range_normal['max']+1, 'max': cicle_range_normal['max'] + map_temperature['low'][0]}
cicle_range_medium = {'min': cicle_range_low['max']+1, 'max': cicle_range_low['max'] + map_temperature['medium'][0]}
cicle_range_high = {'min': cicle_range_medium['max']+1, 'max': cicle_range_medium['max'] + map_temperature['high'][0]}

max_cicles = (cicle_range_high['max'])
cicle = 1
i = 0
while (True):

    time.sleep(2)

    i += 1

    if cicle == 1:
        direction = 'increase'
    elif cicle == max_cicles:
        direction = 'decrease'

    if cicle >= cicle_range_normal['min'] and cicle < cicle_range_normal['max']:
        now_level = 'normal'
    elif cicle >= cicle_range_low['min'] and cicle < cicle_range_low['max']:
        now_level = 'low'
    elif cicle >= cicle_range_medium['min'] and cicle < cicle_range_medium['max']:
        now_level = 'medium'
    elif cicle >= cicle_range_high['min'] and cicle < cicle_range_high['max']:
        now_level = 'high'

    if direction == 'increase':
        cicle += 1
    else:
        cicle -= 1

    temperature = random.uniform(map_temperature[now_level][1],map_temperature[now_level][2])
    url_string = 'http://stepesbd.ddns.net:8086/write?db=vital_signs'
    #url_string = 'http://localhost:8086/write?db=vital_signs'
    data_string = 'body_temperature,person='+person+' value='+str(temperature)

    r = requests.post(url_string, data=data_string)
