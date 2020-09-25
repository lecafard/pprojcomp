import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import ReadOnlySchedule from "../../components/schedule/read_only_schedule";
import { Meeting } from '../../api/schemas';
import api from '../../api';
import { constructDays, constructTimes } from "../../utilities";

import style from "./style.module.css";

function ManageMeetingPage({ match: { params: { id } } }: RouteComponentProps<{ id?: string }>) {
  const [eventDetails, setEventDetails] = useState<Meeting | null>(null);
  const [people, setPeople] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      api.getEventByOwnerKey(id)
        .then((data) => {
          setEventDetails(data.data);
          setPeople(Object.keys(data.data.schedules));
        })
        .catch((e) => {
          console.error(e);
        });
    })();
  }, [id]);

  if (!eventDetails) return null;

  return (
    <div className={`${style.view}`}>
      <div className="container">
        <div className={`${style.eventDetails}`}>
          <h2>{eventDetails.name}</h2>
          <div>
            <h3>{eventDetails.location}</h3>
            <p>Guest key: {eventDetails.guest_key}</p>
          </div>
        </div>

        <div className={`row`}>
          <div className="col" style={{display: "flex"}}>
            <ReadOnlySchedule
              dates={eventDetails.options.type === "day" ?
                constructDays(eventDetails.options.days) :
                eventDetails.options.dates.map((d) => dayjs(d).format("DD MMM YY"))
              }
              times={constructTimes(
                eventDetails.options["min_time"],
                eventDetails.options["max_time"]
              )}
              userSelectedTimes={people.reduce((obj, x) => Object.assign(obj, { [x]: eventDetails.schedules[x] }), {})}
            />
          </div>

          <div className="col" style={{display: "flex"}}>
            <ul className={`${style["list"]}`}>
              {Object.keys(eventDetails.schedules).map(name => {
                return (     
                  <li className={`${style["list-item"]} ${style.title}`}
                    onClick={() => setPeople(
                      people.includes(name) ? 
                      people.filter((n) => n !== name) :
                      [...people, name]
                    )}
                    key={name}
                  > 
                    {name}
                    <br/>
                    <p className={`${style["notes"]}`}>{eventDetails.notes[name] ? eventDetails.notes[name] : "No notes"}</p>
                    <br/>
                    <p className={`${style["toggle"]}`}>{!people.includes(name) ? "Show" : "Hide"}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ManageMeetingPage);
