import React, { useState, useEffect } from "react";
import dayjs from 'dayjs';

import ReadOnlySchedule from "../../components/schedule/read_only_schedule";
import { Meeting } from '../../api/schemas';
import api from '../../api';
import { DAYS } from '../../constants';

import style from "./style.module.css";

function ManageMeetingPage() {
  const id = "qxaQVT5_-F9oaMa4";
  const [eventDetails, setEventDetails] = useState<Meeting | null>(null);
  const [dates, setDates] = useState();
  const [times, setTimes] = useState([]);
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    (async () => {
      api.getEventByOwnerKey(id)
        .then((data) => setEventDetails(data.data))
        .catch((e) => {
          console.error(e);
        });
    })();
  }, []);

  if (!eventDetails) return null;

  return (
    <div className={` ${style.view}`} >
      <div className="container" style={{display: "flex"}}>
        <ReadOnlySchedule
          dates={eventDetails.options.type === "day" ?
            constructDays(eventDetails.options.days) :
            eventDetails.options.dates.map((d) => dayjs(d).format("DD MMM YY"))
          }
          times={constructTimes(
            eventDetails.options["min_time"],
            eventDetails.options["max_time"]
          )}
        />
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

export default ManageMeetingPage;
