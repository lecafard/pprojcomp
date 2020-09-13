import bcrypt
from models import db, Meeting, Entry

def create_user(meeting_id, name, password, schedule=b"", notes=""):
    """
    Creates an entry object with some default values, and additionally hashes the password.
    """
    digest = ""
    if password:
        # hash the digest
        digest = bcrypt.hashpw(
            password.encode("ascii"),
            bcrypt.gensalt()
        ).decode("ascii")
    
    # create new entry
    entry = Entry(
        meeting_id=meeting_id,
        name=name,
        password=digest,
        availability=b"",
        notes=""
    )
    
    db.session.add(entry)
    return entry