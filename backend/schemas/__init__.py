# use 15 minute increments instead of 86400 seconds
# data objects used for validation

auth = {
  "$schema": "http://json-schema.org/draft-07/schema#",
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

admin_delete = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": ["name"]
}

guest_auth = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Guest auth object",
  "type": "object",
  "properties": {
    "auth": auth
  },
  "required": ["auth"]
}

guest_entry = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Guest entry object",
  "type": "object",
  "properties": {
    "auth": auth,
    "schedule": {
      "type": "string",
      "pattern": "[01]+",
      "minLength": 1,
      "maxLength": 1344
    },
    "notes": {
      "type": "string",
      "maxLength": 1024
    }
  },
  "required": ["auth"]
}

options = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Schedule options",
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
      "type": "string",
      "description": "Days of the week",
      "pattern": "[01]{7}"
    },
    "dates": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "date"
      },
      "minItems": 1,
      "maxItems": 40
    },
    "min_time": {
      "type": "integer",
      "description": "Earliest possible time for meeting",
      "minimum": 0,
      "maximum": 48
    },
    "max_time": {
      "type": "integer",
      "description": "Latest possible time for meeting",
      "minimum": 0,
      "maximum": 48
    }
  },
  "allOf": [
    {
      "required": [
        "type",
        "min_time",
        "max_time"
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
  "description": "Meeting Object",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Meeting name",
      "minLength": 1
    },
    "location": {
      "type": "string",
      "description": "Meeting location",
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
    "options": options
  },
  "required": [
    "name",
    "location",
    "private",
    "allow_registration"
  ]
}