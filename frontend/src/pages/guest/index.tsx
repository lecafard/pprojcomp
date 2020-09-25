import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import dayjs from 'dayjs';

import Schedule from '../../components/schedule';

import style from "./style.module.css";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import api from '../../api';
import { DAYS } from '../../constants';
import { Meeting, AuthedSchedule, Auth } from '../../api/schemas';

function ErrorBox(props: any) {
  return (
    <div className={`container ${style.errorBox}`}>
      <h3> {props.code} :( </h3>
    </div>
  )
}

function GuestPage({ match: { params: { id } } }: RouteComponentProps<{ id?: string }>) {
  const [eventDetails, setEventDetails] = useState<Meeting | null>(null);
  const [auth, setAuth] = useState<Auth>({
    name: "",
    password: ""
  });
  const [schedule, setSchedule] = useState<AuthedSchedule>(null);

  useEffect(() => {
    (async () => {
      api.getEventByGuestKey(id)
        .then((data) => setEventDetails(data.data))
        .catch((e) => {
          console.error(e);
        });
    })();
  }, []);

  useEffect(() => {
    if (eventDetails) {
      let thisMeeting = {
        "id": eventDetails.guest_key,
        "name": eventDetails.name,
        "location": eventDetails.location
      }
      let arr = JSON.parse(localStorage.getItem("myMeetings"))
      if (arr === null) {
        localStorage.setItem("myMeetings", JSON.stringify({ "meetingsList": [thisMeeting] }));
      } else {
        arr['meetingsList'] = arr['meetingsList'].filter((x) => x.id !== eventDetails.guest_key)
        arr['meetingsList'].push(thisMeeting)
        localStorage.setItem("myMeetings", JSON.stringify({ "meetingsList": arr['meetingsList'] }));
      }
    }
  }, [eventDetails]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    api.getAuthedGuest(id, auth.name, auth.password)
      .then((data) => {
        setSchedule(data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleSave = () => {
    api.updateAuthedGuest(id, auth.name, auth.password, schedule)
      .then((data) => {
        setEventDetails({...eventDetails, schedules: {
          ...eventDetails.schedules,
          [auth.name]: schedule.schedule 
        }});
        setSchedule(null);
      })
      .catch((err) => {
        alert(err);
      });
  }

  if (!eventDetails) {
    return (
      <ErrorBox code={"Couldn't find meeting " + id} />
    )
  };

  return (
    <div className={` ${style.view}`}>
      <div className="container">
        <div className={` ${style.eventDetails}`}>
          <h3>
            {eventDetails.name}
          </h3>
          <h4>
            {eventDetails.location}
          </h4>
        </div>

        <div className={`row`}>
          <div className={`col`} style={{ display: "flex" }}>
            {schedule ? <div className="container">
              <div className="row">
                <h3 className="is-center">
                  Select your availability
                </h3>
              </div>
              <div className="row is-center">
                <Schedule
                  days={eventDetails.options.type === "day" ?
                    constructDays(eventDetails.options.days) :
                    eventDetails.options.dates.map((d) => dayjs(d).format("DD MMM YY"))
                  }
                  slots={constructTimes(
                    eventDetails.options["min_time"],
                    eventDetails.options["max_time"]
                  )}
                  availability={schedule.schedule}
                  setAvailability={(entry) => setSchedule({...schedule, schedule: entry})}
                />
                <label>Notes (optional)</label>
                <textarea value={schedule.notes} onChange={(e) => setSchedule({...schedule, notes: e.target.value})}>
                </textarea>
              </div>
              <div className="row is-center" style={{ marginTop: "20px" }}>

                <button
                  className="button bg-error text-white"
                  onClick={() => setSchedule(null)}
                >
                  Logout
                </button>
                <button
                  className="button bg-success text-white"
                  onClick={handleSave}
                >
                  Submit
                </button>
              </div>
            </div> :
              <div className="container">
                <div className="row">
                  <h3>
                    Please login to enter your schedule
                  </h3>
                </div>
                <div className="row is-center">
                  <form onSubmit={handleLogin}>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      onChange={(name: ChangeEvent<HTMLInputElement>) => setAuth({
                        ...auth,
                        name: name.target.value
                      })}/>
                    <label>Password (optional)</label>
                    <input
                      type="password"
                      name="password"
                      onChange={(password: ChangeEvent<HTMLInputElement>) => setAuth({
                        ...auth,
                        password: password.target.value
                      })}
                    />
                    <br />

                    <button type="submit" className="button bg-success text-white">
                      Submit
                    </button>
                  </form>
                </div>
              </div>}
          </div>

          {!eventDetails.private ? (<div className={`col`} style={{ height: "100%" }}>
            <div className="container">
              <div className="row">
                <h3>
                  Group availability
                </h3>
              </div>
              <div className="row is-center">
                <Schedule
                  days={eventDetails.options.type === "day" ?
                    constructDays(eventDetails.options.days) :
                    eventDetails.options.dates.map((d) => dayjs(d).format("DD MMM YY"))
                  }
                  slots={constructTimes(
                    eventDetails.options["min_time"],
                    eventDetails.options["max_time"]
                  )}
                  schedules={schedule ? Object.assign(eventDetails.schedules, {
                    [auth.name]: schedule ? schedule.schedule : ""
                  }) : eventDetails.schedules}
                />
              </div>
            </div>
          </div>) : null}
        </div>
      </div>
    </div>
  );
}

function constructDays(days: string) {
  return DAYS.filter((_, i) => days[i] === "1");
}

function constructTimes(minTime: number, maxTime: number) {
  const begin = dayjs().startOf('day');
  return (new Array(maxTime - minTime).fill(0)).map((_, i) => begin.add(
    (minTime + i) * 30, 'minute'
  ).format("HH:mm"));
}

export default withRouter(GuestPage);
