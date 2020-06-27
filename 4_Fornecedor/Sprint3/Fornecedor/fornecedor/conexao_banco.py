from django.db import connections
cursor = connections['hospital'].cursor()
cursor.execute("use stepesbd");

cursor.execute("select * from stepesbd.Order where ord_date = '2020-05-27'");