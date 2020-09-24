import constructScheduleGrid from "./base_schedule";

interface ReadOnlyScheduleProps {
  dates?: string[];
  times: string[];
  userSelectedTimes?: {};
}

function ReadOnlySchedule({dates=["Monday"], times, userSelectedTimes}: ReadOnlyScheduleProps) {
  return constructScheduleGrid({
    days: dates,
    slots: times, schedules: userSelectedTimes
  });
}

export default ReadOnlySchedule;