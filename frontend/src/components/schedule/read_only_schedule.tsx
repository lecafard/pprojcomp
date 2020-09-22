import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface ReadOnlyScheduleProps {
  dates?: Array<string>;
  times: dayjs.Dayjs[];
  userSelectedTimes?: Array<any>;
}

function ReadOnlyScheduleProps({dates=["Monday"], times, userSelectedTimes}: ReadOnlyScheduleProps) {
  const grid = constructScheduleGrid(dates, times);

  useEffect(() => {
    if (!userSelectedTimes) return;

    for (let col = 0; col < dates.length + 1; col++) {
      for (let row = 0; row < times.length + 1; row++) {
        const elem = document.getElementsByClassName("read-only-schedule")[0]
                             .querySelector(`[data-col='${col}'][data-row='${row}']`);
        if (!elem) continue;
        else if (userSelectedTimes[row][col]) elem.classList.add(styles.selected);
        else elem.classList.remove(styles.selected);
      }
    }
  }, [userSelectedTimes]);

  return (
    <div className={`read-only-schedule ${styles.schedule} ${styles.unselectable}`} 
      style={{gridTemplateColumns: `repeat(${dates.length + 1}, 1fr)`,
              gridTemplateRows: `repeat(${times.length + 1}, 1fr)`,
              maxHeight: "30vh"}}
    >
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

export default ReadOnlyScheduleProps;