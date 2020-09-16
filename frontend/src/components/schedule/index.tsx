import React, { useEffect, useState } from 'react';

import styles from "./style.module.css";

interface ScheduleProps {
  days?: number;
}

function Schedule({days=7}: ScheduleProps) {
  const [clickStart, setClickStart] = useState([null, null]);
  const [clickEnd, setClickEnd] = useState([null, null]);
  const grid = constructScheduleGrid(days);

  useEffect(() => {
    const [startRow, startCol] = clickStart;
    const [endRow, endCol] = clickEnd;

    console.log(startRow, startCol);

    for (let row of grid) {
      for (let cell of row) {
        const row = cell.props["data-row"];
        const col = cell.props["data-col"];
        if (row && row >= startRow && col >= startCol && row <= endRow && col <= endCol) {
          document.querySelector(`[data-col='${col}'][data-row='${row}']`).classList.toggle(styles.selected);
        }
      }
    }
  }, [clickEnd]);

  return (
    <div className={styles.schedule} 
      onMouseDown={e => {
        const cell = e.target as HTMLDivElement;
        setClickStart([cell.dataset.row, cell.dataset.col]);
      }}
      onMouseUp={e => {
        const cell = e.target as HTMLDivElement;
        setClickEnd([cell.dataset.row, cell.dataset.col]);
      }}
    >
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
        grid[i].push(<label className={styles.unselectable} data-col={i} data-row={j}>Time</label>);
      }
    } else {
      for (let j = 0; j < 20; j++) {
        if (j === 0) {
          // TODO: Figure out date logic
          grid[i].push(<label className={styles.unselectable} data-col={i} data-row={j}>Day</label>)
        } else {
          grid[i].push(<div data-col={i} data-row={j} className={styles.cell}></div>);
        }
      }
    }
  }

  return grid;
}


export default Schedule;