import React from 'react';

import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";

import styles from "./style.module.css";

dayjs.extend(weekday);

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function constructScheduleGrid(dates: Array<string>, times: dayjs.Dayjs[]) {
  const grid = Array.from(Array(dates.length + 1));

  for (let i = 0; i < dates.length + 1; i++) {
    grid[i] = [];
    if (i === 0) {
      grid[0][0] = <div/>;
      for (let j = 1; j < times.length + 1; j++) {
        grid[i].push(<label className={`${styles.unselectable} ${styles.label}`} data-col={i} data-row={j}>
                       {times[j - 1].format("hh:mm a")}
                     </label>
        );
      }
    } else {
      for (let j = 0; j < times.length + 1; j++) {
        if (j === 0) {
          grid[i].push(<label className={`${styles.unselectable} ${styles.label}`} data-col={i} data-row={j}>
                         <div className={`${styles.date}`}>{dayjs(dates[i - 1]).format("MMM DD")}</div>
                         <div className={`${styles.weekday}`}>{daysOfWeek[dayjs(dates[i - 1]).weekday()]}</div>
                       </label>
          );
        } else {
          grid[i].push(<div data-col={i} data-row={j} className={styles.cell}/>);
        }
      }
    }
  }

  return grid;
}

export default constructScheduleGrid;