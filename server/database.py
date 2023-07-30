import psycopg2
import time
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("[DATABASE]")

class Database:
    def __init__(self):
        self.instance = self.setup_database()

    def setup_database(self, retry_interval = 5):
        retries = 0
        connected = False
        while not connected:
            try:
                connection = psycopg2.connect(
                    host = 'database',
                    user = 'cosmin',
                    password = 'fdcaf0f0-2e2d-11ee-be56-0242ac120002',
                    database = 'contacts',
                    port = '5432'
                )
                log.info('Connected to the database!')
                return connection
            except psycopg2.OperationalError as e:
                log.info(f'Connection attempt {retries + 1} failed. Retrying...')
                retries += 1
                time.sleep(retry_interval)

    def close_connection(self):
        self.instance.close()