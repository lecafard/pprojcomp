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

function convertToArray(str: string, size: number) {
  let out = new Array(size).fill(0);
  if (!str) return out;
  for (let i = 0; i < str.length; i++) {
    out[i] = (str[i] === "1") ? 1 : 0;
  }
  return out;
}

interface Props {
  days: string[];
  slots: string[];
  schedules?: { [key: string]: string };
  availability?: string;
  setAvailability?: (string) => void;
}

function ScheduleGrid({days, slots, schedules={}, availability, setAvailability}: Props) {
  const [mouseDown, setMouseDown] = useState<boolean | null>(null);
  const [mouseStart, setMouseStart] = useState([0, 0]);
  const [me, setMe] = useState(convertToArray(availability, days.length * slots.length));

  useEffect(() => {
    setMe(convertToArray(availability, days.length * slots.length));
  }, [availability]);

  const names = Object.keys(schedules).filter((s) => schedules[s] !== "");
  const items = names.map((name) => schedules[name]);

  const handleDown = (col: number, row: number) => {
    if (!setAvailability) return null;

    return () => {
      setMouseStart([col, row]);
      if (me[col * slots.length + row]) {
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


      const minCol = min(col, mouseStart[0]);
      const maxCol = max(col, mouseStart[0]);
      const minRow = min(row, mouseStart[1]);
      const maxRow = max(row, mouseStart[1]);

      for (let i = minCol; i <= maxCol; i++) {
        for (let j = minRow; j <= maxRow; j++) {
          me[i * slots.length + j] = (mouseDown ? 1 : 0);
        }
      }

      setAvailability(me.join(""));
    }
  }

  const handleHover = (col: number, row: number) => {
    if (!setAvailability) return;

    return () => {
      if (mouseDown === null) return;

      const minCol = min(col, mouseStart[0]);
      const maxCol = max(col, mouseStart[0]);
      const minRow = min(row, mouseStart[1]);
      const maxRow = max(row, mouseStart[1]);

      const res = convertToArray(availability, days.length * slots.length);
      for (let i = minCol; i <= maxCol; i++) {
        for (let j = minRow; j <= maxRow; j++) {
          res[i * slots.length + j] = (mouseDown ? 1 : 0);
        }
      }
      
      setMe(res);
    }
  }

  const handleLeave = () => {
    setMouseDown(null);
    if (!setAvailability) return null;
    setMe(convertToArray(availability, days.length * slots.length));
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
          title={
            `${items.map(mapRows(i * slots.length + j)).reduce(sum, 0)} / ${items.length} available` +
            (items.length ? `\n${names.filter((n) => schedules[n][i * slots.length + j] === '1')
            .join(", ")}` : '')
          }
          className={`${styles.cell}`} style={{
            backgroundColor: setAvailability ? (me[i * slots.length + j] ? `rgb(0, 110, 255)` : 'white')
              : `rgba(0, 110, 255, ${items.map(mapRows(i * slots.length + j)).reduce(sum, 0) / items.length})`
          }} key={`d${i}t${j}`} />
      )))))
    ].flat()}</div>);
}

export default ScheduleGrid;