import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Schedule from '../../components/schedule';

import style from "./style.module.css";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import api from '../../api';

function ErrorBox(props: any) {
  return (
    <div className={`container ${style.errorBox}`}>
      <h3> {props.code} :( </h3>
    </div>
  )
}


function GuestPage({ match: { params: { id } } }: RouteComponentProps<{ id: string }>) {
  const [eventDetails, setEventDetails] = useState(null);

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
      console.log(localStorage.getItem("myMeetings"))
    }
  }, [eventDetails])

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
            <div className="container">
              <div className="row">
                <h3 className="is-center">
                  Select your availability
              </h3>
              </div>
              <div className="row is-center">
                <Schedule
                  dates={eventDetails.options.type === "day" ?
                    constructDays(eventDetails.options.days) : eventDetails.options.dates
                  }
                  times={constructTimes(eventDetails.options.minTime, eventDetails.options.maxTime)}
                />
              </div>
            </div>
          </div>

          <div className={`col`} style={{ height: "100%" }}>
            <div className="container">
              <div className="row">
                <h3 className="is-center">
                  Group availability
              </h3>
              </div>
              <div className="row is-center">
                <Schedule
                  dates={eventDetails.options.type === "day" ?
                    constructDays(eventDetails.options.days) : eventDetails.options.dates
                  }
                  times={constructTimes(eventDetails.options.minTime, eventDetails.options.maxTime)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function constructDays(days: Array<string>) {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  return weekDays.filter((_, i) => days[i] === "1");
}

function constructTimes(minTime: number, maxTime: number) {
  const times = [dayjs().hour(0).minute(0)];
  for (let i = 1; i < maxTime; i++) {
    times.push(times[i - 1].add(15, "minute"));
  }

  return times.slice(minTime);
}

export default withRouter(GuestPage);
