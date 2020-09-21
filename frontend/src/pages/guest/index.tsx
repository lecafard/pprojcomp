import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { ReadOnlySchedule, SubmitSchedule } from '../../components/schedule';

import style from "./style.module.css";

const path = window.location.pathname.split('/');
const guestId = path[path.length - 1];

function GuestPage() {
  const [eventDetails, setEventDetails] = useState({} as any);
  const [userSelectedTimes, setUserSelectedTimes] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/guest/${guestId}`);
      const json = await res.json();
      setEventDetails(json);
    })();
  }, []);

  if (!eventDetails?.data) return null;

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
                <SubmitSchedule
                  dates={eventDetails.data.options.type === "day" ?
                          constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                  }
                  times={constructTimes(eventDetails.data.options["min_time"], eventDetails.data.options["max_time"])}
                  timeHandler={setUserSelectedTimes}
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
                <ReadOnlySchedule
                  dates={eventDetails.data.options.type === "day" ?
                          constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                  }
                  times={constructTimes(eventDetails.data.options["min_time"], eventDetails.data.options["max_time"])}
                  userSelectedTimes={userSelectedTimes}
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
    times.push(times[i - 1].add(30, "minute"));
  }

  return times.slice(minTime);
}

function createDateString(selectedDays: Array<any>) {
  const days = selectedDays[0].length;
  const times = selectedDays.length;

  let dateString = "";

  for (let day = 1; day < days; day++) {
    for (let time = 1; time < times; time++) {
      dateString += selectedDays[time][day];
    }
  }

  return dateString;
}

export default GuestPage;
