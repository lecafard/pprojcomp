import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Schedule from '../../components/schedule';

import style from "./style.module.css";

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

  if (!eventDetails?.data) return null;

  return (
    <div className={`container`}>
      <div className={`row`}>
        <h1>
          {eventDetails.data.name}
        </h1>
      </div>

      <div className={`row`}>
        <div className={`is-center col`} style={{maxHeight: "75vh"}}>
          <Schedule 
            dates={eventDetails.data.options.type === "day" ? 
                    constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
            }
            times={constructTimes(eventDetails.data.options.minTime, eventDetails.data.options.maxTime)}
          />
        </div>

        <div className={`col`} style={{height: "100%"}}>
          a
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