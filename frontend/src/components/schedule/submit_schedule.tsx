import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface SubmitScheduleProps {
  dates?: Array<string>;
  times: dayjs.Dayjs[];
  timeHandler: any;
  clearDates: boolean;
}

function SubmitSchedule({dates=["Monday"], times, timeHandler,  clearDates}: SubmitScheduleProps) {
  const [availability, setAvailability] = useState("");
  return constructScheduleGrid({
    days: dates, 
    slots: times.map(t => t.format("HH:MM")), schedules: {}, 
    availability, 
    setAvailability: setAvailability
  });
}

export default SubmitSchedule;