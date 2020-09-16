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

## api calls and payloads
POST /owner/new
```json
{
  "name": "something",
  "location": "something",
  "private": false,
  "allow_registration": true,
  "options": {
    "type": "day|date", // either day or date
    "dates": ["2020-01-01", "2020-01-02"], // if date, specify comma separated list of dates
    "days": "1011111", // 7-long list of days for meeting (mon to sun)
    "minTime": 0, // earliest scheduled 15-minute block for meeting
    "maxTime": 96 // latest scheduled 15 minute block for meeting
  }
}
```
creates a new meeting and returns guest and owner keys

POST /owner/<owner_key>/create_user
{
  "name": "a person",
  "password": ""
}

creates a user from the admin side, useful when allow_registration is false

POST /owner/<owner_key>/delete_user
{
  "name": "a person"
}

deletes a user from the admin side

POST /guest/<guest_key>/auth
```json
{
  "name": "a new person",
  "password": ""
}
```
allows you to get the guests schedule and notes. guest schedules are returned as base64 encoded bits (eg 1000101)

POST /guest/<guest_key>/schedule
```json
{
  "auth": {
    "name": "a person",
    "password": ""
  },
  "entry": {
    "from": 0,
    "to": 40,
    "state": true // available/not available
  }
}
```

modify a guest's schedule. 

POST /guest/<guest_key>/notes
```json
{
  "auth": {
    "name": "a person",
    "password": ""
  },
  "notes": "text"
}
```

modify a guest's notes
