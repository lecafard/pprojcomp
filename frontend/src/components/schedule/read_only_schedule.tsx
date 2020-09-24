import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

interface ReadOnlyScheduleProps {
  dates?: string[];
  times: dayjs.Dayjs[];
  userSelectedTimes?: any;
}

function ReadOnlySchedule({dates=["Monday"], times, userSelectedTimes}: ReadOnlyScheduleProps) {
  return constructScheduleGrid({
    days: dates,
    slots: times.map(t => t.format("HH:MM")), schedules: userSelectedTimes || {}
  });
}

export default ReadOnlySchedule;