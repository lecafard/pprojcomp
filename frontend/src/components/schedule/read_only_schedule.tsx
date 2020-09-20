import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface ReadOnlyScheduleProps {
  dates?: Array<string>;
  times: dayjs.Dayjs[];
}

function ReadOnlyScheduleProps({dates=["Monday"], times}: ReadOnlyScheduleProps) {
  const grid = constructScheduleGrid(dates, times);

  return (
    <div className={`${styles.schedule} ${styles.unselectable}`} 
      style={{gridTemplateColumns: `repeat(${dates.length + 1}, 1fr)`,
              gridTemplateRows: `repeat(${times.length + 1}, 1fr)`,
              maxHeight: "50vh"}}
    >
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

export default ReadOnlyScheduleProps;