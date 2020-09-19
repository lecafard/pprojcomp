import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Schedule from '../../components/schedule';

import style from "./style.module.css";

function ErrorBox(props: any) {
    return (
        <div className={`container ${style.errorBox}`}>
            <h3> {props.code} :( </h3>
        </div>
    )
}

const path = window.location.pathname.split('/');
const guestId = path[path.length - 1];

function GuestPage() {
  const [eventDetails, setEventDetails] = useState({} as any);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/guest/${guestId}`);
      const json = await res.json();
      setEventDetails(json);
    })();
  }, []);

  useEffect(() => {
      if (eventDetails?.data) {
          let thisMeeting = {
              "id": eventDetails.data.guest_key,
              "name": eventDetails.data.name,
              "location": eventDetails.data.location
          }
          let arr = JSON.parse(localStorage.getItem("myMeetings"))
          if (arr === null) {
              localStorage.setItem("myMeetings", JSON.stringify({"meetingsList": [thisMeeting]}));
          } else {
              arr['meetingsList'] = arr['meetingsList'].filter((x) => x.id !== eventDetails.data.guest_key)
              arr['meetingsList'].push(thisMeeting)
              localStorage.setItem("myMeetings", JSON.stringify({"meetingsList": arr['meetingsList']}));
          }
          console.log(localStorage.getItem("myMeetings"))
      }
  }, [eventDetails])

  if (!eventDetails?.data) {
      return (
          <ErrorBox code={"Couldn't find meeting " + guestId}/>
      )
  };

  return (
    <div className={` ${style.view}`}>
    <div className="container">
    <div className={` ${style.eventDetails}`}>
        <h3>
          {eventDetails.data.name}
        </h3>
        <h4>
          {eventDetails.data.location}
        </h4>
    </div>

      <div className={`row`}>
        <div className={`col`} style={{display: "flex"}}>
          <div className="container">
            <div className="row">
              <h3 className="is-center">
                Select your availability
              </h3>
            </div>
            <div className="row is-center">
              <Schedule
                dates={eventDetails.data.options.type === "day" ?
                        constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                }
                times={constructTimes(eventDetails.data.options.minTime, eventDetails.data.options.maxTime)}
              />
            </div>
          </div>
        </div>

        <div className={`col`} style={{height: "100%"}}>
          <div className="container">
            <div className="row">
              <h3 className="is-center">
                Group availability
              </h3>
            </div>
            <div className="row is-center">
              <Schedule
                dates={eventDetails.data.options.type === "day" ?
                        constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                }
                times={constructTimes(eventDetails.data.options.minTime, eventDetails.data.options.maxTime)}
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

export default GuestPage;
