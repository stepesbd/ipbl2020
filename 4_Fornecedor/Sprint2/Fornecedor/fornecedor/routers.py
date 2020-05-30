class HospitalRouter:

    def db_for_read(self, model, **hints):

        if model._meta.db_table == 'Order':
            return 'hospital'
        return None
