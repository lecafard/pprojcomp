import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import constructScheduleGrid from "./base_schedule";

import styles from "./style.module.css";

interface SubmitScheduleProps {
  dates?: Array<string>;
  times: dayjs.Dayjs[];
  timeHandler: any;
  clearDates: boolean;
}

function SubmitSchedule({dates=["Monday"], times, timeHandler,  clearDates}: SubmitScheduleProps) {
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
          if (!startState) 
            document.querySelector(`[data-col='${col}'][data-row='${row}']`)
                    .classList.add(styles.selected);
          else 
            document.querySelector(`[data-col='${col}'][data-row='${row}']`)
                    .classList.remove(styles.selected);
        }
      }
    }
  }, [clickEnd]);

  useEffect(() => { 
    clearAllCells(grid);
    timeHandler(getSelectedCells(grid));
  }, [clearDates]);

  return (
    <div className={`${styles.schedule} ${styles.unselectable}`} 
      style={{gridTemplateColumns: `repeat(${dates.length + 1}, 1fr)`,
              gridTemplateRows: `repeat(${times.length + 1}, 1fr)`,
              maxHeight: "50vh"}}
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
      onMouseUp={() => {
        setMouseDown(false);
        timeHandler(getSelectedCells(grid));
      }}
    >
      {grid.map(row => {
        return row.map(col => col);
      })}
    </div>
  );
}

function getSelectedCells(grid) {
  const selectedGrid = []
  for (let i = 0; i < grid[0].length; i++) selectedGrid.push(new Array(grid.length).fill(0));

  for (let row of grid) {
    for (let cell of row) {
      const row = cell.props["data-row"];
      const col = cell.props["data-col"];

      if (document.querySelector(`[data-col='${col}'][data-row='${row}']`)
                  ?.classList.contains(styles.selected)) {
        selectedGrid[row][col] = 1;
      }
    }
  }
  
  return selectedGrid;
}

function clearAllCells(grid) {
  for (let row of grid) {
    for (let cell of row) {
      const row = cell.props["data-row"];
      const col = cell.props["data-col"];
      document.querySelector(`[data-col='${col}'][data-row='${row}']`)
              ?.classList.remove(styles.selected);
    }
  }
}

export default SubmitSchedule;