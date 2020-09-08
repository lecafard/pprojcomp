schedule = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/entries.json",
  "description": "Schedule entries.",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "from": {
        "type": "number",
        "minimum": 0,
        "maximum": 86400
      },
      "to": {
        "type": "number",
        "minimum": 0,
        "maximum": 86400
      },
      "name": {
        "type": "string",
        "minLength": 1
      }
    },
    "required": [
      "from",
      "to"
    ]
  }
}

auth = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/auth.json",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["name", "password"]
}

guest_auth = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/guest_auth.json",
  "description": "Guest entry object",
  "type": "object",
  "properties": {
    "auth": auth
  },
  "required": ["auth"]
}

guest_entry = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/guest_entries.json",
  "description": "Guest entry object",
  "type": "object",
  "properties": {
    "auth": auth,
    "schedule": schedule
  },
  "required": ["auth", "schedule"]
}

schedule = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/schedule.json",
  "description": "A schedule",
  "type": "object",
  "properties": {
    "type": {
      "description": "The type of meeting",
      "type": "string",
      "enum": [
        "day",
        "date"
      ]
    },
    "days": {
      "type": "array",
      "description": "Days of the week",
      "items": {
        "type": "boolean"
      },
      "minItems": 7,
      "maxItems": 7
    },
    "dates": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "date"
      }
    },
    "minTime": {
      "type": "number",
      "description": "Earliest possible time for meeting",
      "minimum": 0,
      "maximum": 86400
    },
    "maxTime": {
      "type": "number",
      "description": "Latest possible time for meeting",
      "minimum": 0,
      "maximum": 86400
    },
    "schedules": schedule
  },
  "allOf": [
    {
      "required": [
        "type",
        "minTime",
        "maxTime"
      ]
    },
    {
      "if": {
        "properties": {
          "type": {
            "const": "day"
          }
        }
      },
      "then": {
        "required": [
          "days"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "type": {
            "const": "date"
          }
        }
      },
      "then": {
        "required": [
          "dates"
        ]
      }
    }
  ]
}

meeting = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://pprojcomp.ceebs.dev/schema/meeting.json",
  "description": "Meeting Object",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Meeting name",
      "minLength": 1
    },
    "private": {
      "type": "boolean",
      "description": "Schedule privacy to guests"
    },
    "allow_registration": {
      "type": "boolean",
      "description": "Allow users to self register"
    },
    "owner_key": {
      "type": "string",
      "description": "Meeting ID (private)"
    },
    "guest_key": {
      "type": "string",
      "description": "Meeting ID (guest)"
    },
    "schedule": schedule
  },
  "required": [
    "name",
    "private",
    "allow_registration"
  ]
}