import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface ReadOnlyScheduleProps {
  dates?: string[];
  times: dayjs.Dayjs[];
  userSelectedTimes?: any;
}

function ReadOnlySchedule({dates=["Monday"], times, userSelectedTimes}: ReadOnlyScheduleProps) {
  console.log(userSelectedTimes);
  return constructScheduleGrid(dates, times.map(t => t.format("HH:MM")), userSelectedTimes);
}

export default ReadOnlySchedule;