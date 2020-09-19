import React, { useEffect, useState } from 'react';

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
  }, [])

  if (eventDetails?.data) {
    return (
      <div className="is-center" style={{marginTop: "20px"}}>
        <Schedule 
          dates={eventDetails.data.options.type === "day" ? 
                  constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
          }
        />
      </div>
    );
  } else {
    return null;
  }
}

function constructDays(days) {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const outputDays = [];
  for (let i in days) if (days[i] === "1") outputDays.push(weekDays[i]);
  return outputDays;
}

export default GuestPage;