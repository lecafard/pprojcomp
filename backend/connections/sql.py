import config
import sqlalchemy 
from models import Base
from sqlalchemy.orm import sessionmaker

db = sqlalchemy.create_engine(config.POSTGRES_CONNECTION, echo=config.FLASK_ENV == "development")  
engine = db.connect()

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)