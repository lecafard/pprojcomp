import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import styles from "./style.module.css";

interface ScheduleProps {
  dates?: Array<string>;
  times: dayjs.Dayjs[];
}

function Schedule({dates=["Monday"], times}: ScheduleProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const [startState, setStartState] = useState(false);
  const [clickStart, setClickStart] = useState([null, null]);
  const [clickEnd, setClickEnd] = useState([null, null]);
  const grid = constructScheduleGrid(dates, times);

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

  console.log(dates)

  return (
    <div className={`${styles.schedule} ${styles.unselectable}`} 
      style={{gridTemplateColumns: `repeat(${dates.length + 1}, 1fr)`,
              gridTemplateRows: `repeat(${times.length + 1}, 1fr)`}}
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

function constructScheduleGrid(dates: Array<string>, times: dayjs.Dayjs[]) {
  const grid = Array.from(Array(dates.length + 1));
  console.log(times);

  for (let i = 0; i < dates.length + 1; i++) {
    grid[i] = [];
    if (i === 0) {
      grid[0][0] = <div></div>;
      for (let j = 1; j < times.length + 1; j++) {
        // TODO: Figure out time logic
        grid[i].push(<label className={`${styles.unselectable} ${styles.label}`} data-col={i} data-row={j}>{times[j - 1].format("hh:mm a")}</label>);
      }
    } else {
      for (let j = 0; j < times.length + 1; j++) {
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