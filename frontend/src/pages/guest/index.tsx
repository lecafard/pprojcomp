import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Schedule from '../../components/schedule';

import style from "./style.module.css";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import api from '../../api';


function GuestPage({match}: RouteComponentProps<{id: string}>) {
  const [eventDetails, setEventDetails] = useState({} as any);
  const guestId = match.params.id;

  useEffect(() => {
    (async () => {
      api.getEventByGuestKey(guestId)
        .then((data) => setEventDetails(data.data))
        .catch((e) => {
          console.error(e);
        });
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

export default withRouter(GuestPage);
