I Can't Believe It's Not W2M!
==================

features
--------
- private schedules
- block users from signing up
- public schedules
- won't get slapped by legal

backend
-------
1. run `docker-compose -p when3meet_dev -f docker-compose.dev.yml up` and magic should happen.

backend listens on http://localhost:5000/

frontend
--------
1. cd into frontend
2. Run `yarn install`
3. Run `yarn start`

deploy
------
1. run `docker-compose -p when3meet up`.
2. shove behind another proxy such as Caddy if you want to be safe.
