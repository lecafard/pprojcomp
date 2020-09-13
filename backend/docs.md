# backend docs

## routes

- /guest/<guest_key> - returns meeting information + schedules and notes of everyone if available
  - /auth - POST: return a user's schedule and notes after checking credentials
  - /schedule - POST: update the user's schedule after checking credentials
  - /notes - POST: update the user's notes after checking credentials
- /owner
  - /new - POST: creates a new meeting
  - /<owner_key> - GET: get meeting info + schedulea and notes of everyone, POST: update meeting info (name, location, private, allow_registration)
    - /create_user - POST: create a user with the specified name and password
    - /delete_user - POST: delete a user with the specified name

## data format

### meeting object
```json
{
  "allow_registration": true, // allow users to self register
  "guest_key": "<guest_id>",  // id to call /guest endpoints
  "location": "<string (64)>", // location of meeting
  "name": "<string (64)>", // name of meeting
  "options": {
    // either a 7 character string of days of the week or an array of dates (max 30)
    "days": "1111111", // days of the week (mon-sun)
    "dates": ["2020-01-01", "2020-02-02"], // array of dates
    "maxTime": 96, // max time slot
    "minTime": 0, // min time slot
    "type": "(day | date)"
  }, 
  "private": false, 
  "schedules": {
    "<name>": "<base64 data>"
  },
  "notes": {
    "<name>": "<string (250)>"
  } 
}
```

### schedule
each day is split up into 15 minute chunks, therefore the maximum amount of chunks a day is 96.
the data is stored as a string of bits within the database for efficiency.

data is currently returned to the frontend as a big-endian base64 string. the number of slots is
determined by (maxTime - minTime) * num_days. slots from all days are stored in 1 contigious string.

