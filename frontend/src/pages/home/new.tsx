import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DAYS, DAY_SECONDS, SLOT_LENGTH, MONTHS } from "../../constants";
import api from "../../api";
import { Meeting } from "../../api/schemas";
import dayjs from "dayjs";
import { RouteComponentProps, withRouter } from "react-router-dom";

function New({ history }: RouteComponentProps) {
  const [currentDate, _] = useState(dayjs());
  const { handleSubmit, register, watch, errors } = useForm();
  const [mouseDown, setMouseDown] = useState<boolean | null>(null);
  const [days, setDays] = useState(new Array(7).fill(false));
  const [dates, setDates] = useState<string[]>([]);

  const onSubmit = (values: any) => {
    const meeting: Meeting = {
      name: values.name,
      location: values.location,
      options: {
        type: values.options.type,
        min_time: parseInt(values.options.minTime),
        max_time: parseInt(values.options.maxTime),
      },
      private: !!values.private,
      allow_registration: !!values.allowRegistration,
    };

    if (meeting.options.type === "day") {
      meeting.options.days = days
        .map((v) => (v ? "1" : 0))
        .join("");
    }

    api
      .newMeeting(meeting)
      .then((data) => {
        history.push(`/s/${data.data.owner_key}`);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const type = watch("options[type]");

  return (
    <div onMouseUp={() => setMouseDown(null)} onMouseLeave={() => setMouseDown(null)}>
      <h1 className="is-center">Create a New Meeting</h1>

      {Object.keys(errors).length ? (
        <blockquote
          style={{
            backgroundColor: "var(--color-error)",
          }}
        >
          An error occurred
        </blockquote>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <label>Name</label>
          <input name="name" ref={register} required />
        </p>
        <p>
          <label>Location</label>
          <input name="location" ref={register} required />
        </p>

        <label>Time from:</label>
        <select name="options[minTime]" ref={register()}>
          {Array.from(Array(DAY_SECONDS / SLOT_LENGTH).keys()).map((v) => {
            const time = dayjs()
              .startOf("day")
              .add(v * SLOT_LENGTH, "second");
            return (
              <option key={v} value={v}>
                {`${time.hour().toString().padStart(2, "0")}:` +
                  `${time.minute().toString().padStart(2, "0")}`}
              </option>
            );
          })}
        </select>

        <label>Time to:</label>
        <select name="options[maxTime]" ref={register()}>
          {Array.from(Array(DAY_SECONDS / SLOT_LENGTH).keys()).map((v) => {
            const time = dayjs()
              .startOf("day")
              .add((v + 1) * SLOT_LENGTH, "second");
            return (
              <option key={v + 1} value={v + 1}>
                {`${time.hour().toString().padStart(2, "0")}:` +
                  `${time.minute().toString().padStart(2, "0")}` +
                  `${time.day() !== dayjs().day() ? " +1" : ""}`}
              </option>
            );
          })}
        </select>

        <div className="grouped">
          <label>Type:</label>
          <ul style={{ listStyleType: "none" }}>
            <li>
              <input
                name="options[type]"
                type="radio"
                value="day"
                ref={register}
                required
              />
              <label>Days of the week</label>
            </li>
            <li>
              <input
                name="options[type]"
                type="radio"
                value="date"
                ref={register}
                required
              />
              <label>Certain dates</label>
            </li>
          </ul>
        </div>

        {type === "day" ? (
          <div>
            {DAYS.map((day, i) => (
              <span
                key={i}
                style={{
                  userSelect: "none",
                }}
              >
                <label
                  style={{ backgroundColor: days[i] ? "green" : "red" }}
                  onMouseDown={() => {
                    setDays(days.map((d, j) => (i === j ? !days[i] : d)));
                    setMouseDown(!days[i]);
                  }}
                  onMouseOver={() =>
                    mouseDown !== null && setDays(days.map((d, j) => (i === j ? mouseDown : d)))
                  }
                >
                  {day.substr(0, 3)}
                </label>
              </span>
            ))}
          </div>
        ) : null}

        {type === "date" ? (<div>
          <div style={{userSelect: 'none'}}>
            {new Array(5).fill(0).map((_, week) => (
              <div key={week}>
                {new Array(7).fill(0).map((_, day) => (
                  <span key={day}>
                    <div
                      style={{
                        backgroundColor: dates
                          .indexOf(currentDate.add(week * 7 + day, 'day').format("YYYY-MM-DD")) 
                          !== -1 
                          ? 'green'
                          : 'red',
                        width: '60px',
                        margin: '2px',
                        display: 'inline-block'
                      }}
                      onMouseDown={() => {
                        const date = currentDate.add(week * 7 + day, 'day').format("YYYY-MM-DD");
                        if (dates.indexOf(date) === -1) {
                          setDates(dates.concat(date));
                          setMouseDown(true);
                        } else {
                          setDates(dates.filter((d) => d !== date));
                          setMouseDown(false);
                        }
                      }}
                      onMouseOver={() => {
                        const date = currentDate.add(week * 7 + day, 'day').format("YYYY-MM-DD");
                        mouseDown !== null && (mouseDown
                          ? setDates(dates.concat(date))
                          : setDates(dates.filter((d) => d !== date))
                      )}}
                    >
                        {currentDate.add(week * 7 + day, 'day').date() +
                        ' ' +
                        MONTHS[currentDate.add(week * 7 + day, 'day').month()].substr(0, 3)}
                    </div>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>) : null}

        <p>
          <label>
            <input
              name="private"
              type="checkbox"
              value="day"
              ref={register()}
            />
            Private
          </label>
          <br />

          <label>
            <input
              name="allowRegistration"
              type="checkbox"
              value="day"
              ref={register()}
            />
            Allow Registration
          </label>
        </p>

        <button type="submit">Create!</button>
      </form>
    </div>
  );
}

export default withRouter(New);
