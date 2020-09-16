from connections.sql import db
from datetime import datetime


class Meeting(db.Model):
    __tablename__ = "meetings"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    owner_key = db.Column(db.String(32), nullable=False, unique=True)
    guest_key = db.Column(db.String(32), nullable=False, unique=True)
    name = db.Column(db.String(64), nullable=False)
    location = db.Column(db.String(64), nullable=False)
    private = db.Column(db.Boolean, nullable=False, default=False)
    allow_registration = db.Column(db.Boolean, nullable=False, default=True)
    options = db.Column(db.JSON)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    entries = db.relationship("Entry")


class Entry(db.Model):
    __tablename__ = "entries"

    __table_args__ = (
        db.PrimaryKeyConstraint('meeting_id', 'name'),
        {},
    )

    meeting_id = db.Column(db.Integer, db.ForeignKey('meetings.id'), nullable=False)
    name = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(64))
    availability = db.Column(db.LargeBinary(250))
    notes = db.Column(db.String(250))

    db.UniqueConstraint("meeting_id", "name", name="meeting_id_name_key")