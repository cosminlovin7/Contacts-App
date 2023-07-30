import psycopg2
import time
import logging
from database import Database

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("[MAIN]")

log.info('Server starting...')
log.info('Connecting to the database...')

database = Database()

log.info('Server is up and running!')

while(1):
    log.info('server running...')
    time.sleep(10)