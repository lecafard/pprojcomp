import React, { useEffect, useState } from 'react';

import styles from "./style.module.css";

interface ScheduleProps {
  dates?: Array<string>;
}

function Schedule({dates=["Monday"]}: ScheduleProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const [startState, setStartState] = useState(false);
  const [clickStart, setClickStart] = useState([null, null]);
  const [clickEnd, setClickEnd] = useState([null, null]);
  const grid = constructScheduleGrid(dates.length + 1, dates);

  useEffect(() => {
    const [r1, c1] = clickStart;
    const [r2, c2] = clickEnd;

    const startRow = Math.min(r1, r2);
    const endRow = Math.max(r1, r2);
    const startCol = Math.min(c1, c2);
    const endCol = Math.max(c1, c2);

    for (let row of grid) {
      for (let cell of row) {
        const row = cell.props["data-row"];
        const col = cell.props["data-col"];
        if (row && row >= startRow && col >= startCol 
            && row <= endRow && col <= endCol) {
          if (!startState) {
            document.querySelector(`[data-col='${col}'][data-row='${row}']`).classList.add(styles.selected);
          } else {
            document.querySelector(`[data-col='${col}'][data-row='${row}']`).classList.remove(styles.selected);
          }
        }
      }
    }
  }, [clickEnd]);

  return (
    <div className={`${styles.schedule} ${styles.unselectable}`} 
      onMouseDown={e => {
        setMouseDown(true);
        const cell = e.target as HTMLDivElement;
        setStartState(cell.classList.contains(styles.selected));
        setClickStart([cell.dataset.row, cell.dataset.col]);
      }}
      onMouseOver={e => {
        if (!mouseDown) return;
        const cell = e.target as HTMLDivElement;
        if (!cell.dataset.row) return;
        setClickEnd([cell.dataset.row, cell.dataset.col]);
      }}
      onMouseUp={() => setMouseDown(false)}
    >
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

function constructScheduleGrid(days: number, dates: Array<string>) {
  const grid = Array.from(Array(days));
  
  for (let i = 0; i < days; i++) {
    grid[i] = [];
    if (i === 0) {
      grid[0][0] = <div></div>;
      for (let j = 1; j < 20; j++) {
        // TODO: Figure out time logic
        grid[i].push(<label className={`${styles.unselectable} ${styles.label}`} data-col={i} data-row={j}>Time</label>);
      }
    } else {
      for (let j = 0; j < 20; j++) {
        if (j === 0) {
          // TODO: Figure out date logic
          grid[i].push(<label className={`${styles.unselectable} ${styles.label}`} data-col={i} data-row={j}>{dates[i - 1]}</label>)
        } else {
          grid[i].push(<div data-col={i} data-row={j} className={styles.cell}></div>);
        }
      }
    }
  }

  return grid;
}

export default Schedule;