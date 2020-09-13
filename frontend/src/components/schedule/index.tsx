import React from 'react';

import styles from "./style.module.css";

interface ScheduleProps {
  days?: number;
}

function Schedule({days=7}: ScheduleProps) {
  const grid = Array.from(Array(days));
  for (let i = 0; i < days; i++) {
    grid[i] = [];
    for (let j = 0; j < 20; j++) {
      grid[i].push(<div className={styles.cell}></div>);
    }
  }

  return (
    <div className={styles.schedule}>
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

export default Schedule;