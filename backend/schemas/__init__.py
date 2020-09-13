# use 15 minute increments instead of 86400 seconds

entry = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Schedule entries.",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "from": {
        "type": "integer",
        "minimum": 0,
        "maximum": 96
      },
      "to": {
        "type": "integer",
        "minimum": 0,
        "maximum": 96
      },
      "day": {
        "type": "integer",
        "minimum": 0
      },
      "on": {
        "type": "boolean"
      }
    },
    "required": [
      "from",
      "to",
      "day",
      "on"
    ]
  }
}

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

guest_auth = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Guest entry object",
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
    "entry": entry
  },
  "required": ["auth", "entry"]
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
      },
      "minItems": 1,
      "maxItems": 30
    },
    "minTime": {
      "type": "integer",
      "description": "Earliest possible time for meeting",
      "minimum": 0,
      "maximum": 96
    },
    "maxTime": {
      "type": "integer",
      "description": "Latest possible time for meeting",
      "minimum": 0,
      "maximum": 96
    }
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
    "options": options
  },
  "required": [
    "name",
    "private",
    "allow_registration"
  ]
}