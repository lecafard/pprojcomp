import React, { useState, useEffect } from 'react';
import styles from "./style.module.css";

function mapRows(i: number) {
  return (s: string) => (s[i]);
}

function sum(total: number, num: string) {
  return total + ((num === '1') ? 1 : 0);
}

function min(a: number, b: number) {
  return (a < b) ? a : b;
}

function max(a: number, b: number) {
  return (a > b) ? a : b;
}

function ScheduleGrid(days: string[],
  slots: string[],
  schedules: { [key: string]: string },
  current = "",
  setAvailability?: (string) => void) {

  const [mouseDown, setMouseDown] = useState<boolean | null>(null);
  const [mouseStart, setMouseStart] = useState([0, 0]);
  const [me, setMe] = useState(current);

  useEffect(() => {
    setMe(current);
  }, [current]);

  const names = Object.keys(schedules);
  const items = names.map((name) => schedules[name]);

  const handleDown = (col: number, row: number) => {
    if (!setAvailability) return null;

    return () => {
      setMouseStart([col, row]);
      if (me[col * slots.length + row] === "1") {
        setMouseDown(false);
      } else {
        setMouseDown(true);
      }
    }
  }

  const handleUp = (col: number, row: number) => {
    return () => {
      if (mouseDown === null) return;
      setMouseDown(null);
      if (!setAvailability) return;

      // Calculate what to fill
      let out = new Array(days.length * slots.length).fill(0);
      for (let i = 0; i < me.length; i++) {
        out[i] = (me[i] === "1") ? 1 : 0;
      }

      const minCol = min(col, mouseStart[0]);
      const maxCol = max(col, mouseStart[0]);
      const minRow = min(row, mouseStart[1]);
      const maxRow = max(row, mouseStart[1]);

      for (let i = minCol; i <= maxCol; i++) {
        for (let j = minRow; j <= maxRow; j++) {
          out[i * slots.length + j] = (mouseDown ? 1 : 0);
        }
      }

      setAvailability(out.join(""));
    }
  }

  const handleHover = (col: number, row: number) => {
    if (!setAvailability) return;

    return () => {
      if (mouseDown === null) return;
      // Calculate what to fill
      let out = new Array(days.length * slots.length).fill(0);
      for (let i = 0; i < me.length; i++) {
        out[i] = (me[i] === "1") ? 1 : 0;
      }

      const minCol = min(col, mouseStart[0]);
      const maxCol = max(col, mouseStart[0]);
      const minRow = min(row, mouseStart[1]);
      const maxRow = max(row, mouseStart[1]);

      for (let i = minCol; i <= maxCol; i++) {
        for (let j = minRow; j <= maxRow; j++) {
          out[i * slots.length + j] = (mouseDown ? 1 : 0);
        }
      }

      setMe(out.join(""));
    }
  }

  const handleLeave = () => {
    setMouseDown(null);
    if (!setAvailability) return null;
    setMe(current);
  }



  return (<div className={`read-only-schedule ${styles.schedule} ${styles.unselectable}`}
    style={{
      gridTemplateColumns: `repeat(${days.length + 1}, 1fr)`,
      gridTemplateRows: `repeat(${slots.length + 1}, 1fr)`,
      maxHeight: "50vh"
    }}
    onMouseLeave={handleLeave}
  >
    {[
      [(<div key={"b"} />)],
      slots.map((slot, i) => (
        <label className={`${styles.unselectable} ${styles.label}`} data-col={0} data-row={i} key={`t${i}`}>
          {slot}
        </label>
      )),
      days.map((day, i) => ([
        <label className={`${styles.unselectable} ${styles.label}`} data-col={i + 1} data-row={0} key={`d${i}`}>
          {day}
        </label>
      ].concat(slots.map((_, j) => (
        <div
          onMouseDown={handleDown(i, j)}
          onMouseUp={handleUp(i, j)}
          onMouseOver={handleHover(i, j)}
          className={`${styles.cell}`} style={{
            backgroundColor: me ? (me[i * slots.length + j] === '1' ? `rgb(0, 110, 255)` : 'white')
              : `rgba(0, 110, 255, ${items.map(mapRows(i * slots.length + j)).reduce(sum, 0) / items.length})`
          }} key={`d${i}t${j}`} />
      )))))
    ].flat()}</div>);
}

export default ScheduleGrid;