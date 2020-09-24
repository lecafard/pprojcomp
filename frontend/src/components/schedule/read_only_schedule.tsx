import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface ReadOnlyScheduleProps {
  dates?: string[];
  times: string[];
  userSelectedTimes?: any;
}

function ReadOnlySchedule({dates=["Monday"], times, userSelectedTimes}: ReadOnlyScheduleProps) {
  return constructScheduleGrid({
    days: dates,
    slots: times, schedules: userSelectedTimes
  });
}

export default ReadOnlySchedule;