from django.db import connections
cursor = connections['hospital'].cursor()
cursor.execute("SELECT id, status, etc.. FROM order WHERE id =="+str(variavel)+";");