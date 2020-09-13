from connections.sql import db


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
    schedule = db.Column(db.JSON)
    notes = db.Column(db.Text)

    db.UniqueConstraint("meeting_id", "name", name="meeting_id_name_key")