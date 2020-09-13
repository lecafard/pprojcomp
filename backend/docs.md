# backend docs


## data format

meeting object
```json
{
  "allow_registration": true, // allow users to self register
  "guest_key": "<guest_id>",  // id to call /guest endpoints
  "location": "<string (64)>", // location of meeting
  "name": "<string (64)>", // name of meeting
  "options": {
    // either a 7 character string of days of the week or an array of dates (max 30)
    "days": "1111111",
    "dates": ["2020-01-01", "2020-02-02"], 
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
determined by (maxTime - minTime) * num_days. slots from all days are stored in 1 contigious
string.

