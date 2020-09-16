import React from 'react';

import styles from "./style.module.css";

interface ScheduleProps {
  days?: number;
}

function Schedule({days=7}: ScheduleProps) {
  const grid = constructScheduleGrid(days);

  return (
    <div className={styles.schedule}>
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

function constructScheduleGrid(days: number) {
  const grid = Array.from(Array(days));
  
  for (let i = 0; i < days; i++) {
    grid[i] = [];
    if (i === 0) {
      grid[0][0] = <div></div>;
      for (let j = 1; j < 20; j++) {
        // TODO: Figure out time logic
        grid[i].push(<div data-col={i} data-row={j}>Time</div>);
      }
    } else {
      for (let j = 0; j < 20; j++) {
        if (j === 0) {
          // TODO: Figure out date logic
          grid[i].push(<div data-col={i} data-row={j}>Day</div>)
        } else {
          grid[i].push(<div data-col={i} data-row={j} className={styles.cell}></div>);
        }
      }
    }
  }

  return grid;
}

export default Schedule;