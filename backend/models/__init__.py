from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, autoincrement=True, primary_key=True)
    owner_key = Column(String(32), nullable=False, unique=True)
    guest_key = Column(String(32), nullable=False, unique=True)
    name = Column(String(64), nullable=False)
    location = Column(String(64), nullable=False)
    description = Column(Text)
    options = Column(JSON)
    entries = relationship("Entry")

class Entry(Base):
    __tablename__ = "entries"

    __table_args__ = (
        PrimaryKeyConstraint('meeting_id', 'name'),
        {},
    )

    meeting_id = Column(Integer, ForeignKey('meetings.id'), nullable=False)
    name = Column(String(32), nullable=False)
    password = Column(String(64))
    schedule = Column(JSON)
    notes = Column(Text)

    UniqueConstraint("meeting_id", "name", name="meeting_id_name_key")