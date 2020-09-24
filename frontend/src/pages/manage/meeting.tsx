import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import ReadOnlySchedule from "../../components/schedule/read_only_schedule";
import { Meeting } from '../../api/schemas';
import api from '../../api';
import { DAYS } from '../../constants';

import style from "./style.module.css";
import meetingStyles from "./meeting-styles.module.css";

function ManageMeetingPage({ match: { params: { id } } }: RouteComponentProps<{ id?: string }>) {
  const [eventDetails, setEventDetails] = useState<Meeting | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<{}>()

  useEffect(() => {
    (async () => {
      api.getEventByOwnerKey(id)
        .then((data) => {
          setEventDetails(data.data)
          setFilteredPeople(JSON.parse(JSON.stringify(sampleSchedules)))
        })
        .catch((e) => {
          console.error(e);
        });
    })();
  }, []);

  const sampleSchedules = {"test": "010101101111111111111111010101", "test2": "001111001010101011010" };

  if (!eventDetails || !filteredPeople) return null;

  return (
    <div className={`${style.view}`}>
      <div className="container">
        <div className={`${style.eventDetails}`}>
          <h2>{eventDetails.name}</h2>
          <h3>{eventDetails.location}</h3>
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
              userSelectedTimes={filterSchedules(sampleSchedules, filteredPeople)}
            />
          </div>

          <div className="col" style={{display: "flex"}}>
            <ul className={`${meetingStyles["list"]}`}>
              {Object.keys(sampleSchedules).map(name => {
                return (     
                  <li className={`${meetingStyles["list-item"]} ${meetingStyles.title}`}
                    onClick={() => {
                      filteredPeople.hasOwnProperty(name) ? delete filteredPeople[name] : filteredPeople[name] = "";
                      // this is a bit ugly, but gets React to recognise the change, should probably refactor.
                      setFilteredPeople(JSON.parse(JSON.stringify(filteredPeople))); 
                    }}
                  > 
                    {name}
                    <br/>
                    <p className={`${meetingStyles["notes"]}`}>notes</p>
                    <br/>
                    <p className={`${meetingStyles["toggle"]}`}>Show</p>
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

function constructDays(days: string) {
  return DAYS.filter((_, i) => days[i] === "1");
}

function constructTimes(minTime: number, maxTime: number) {
  const begin = dayjs().startOf('day');
  return (new Array(maxTime - minTime).fill(0)).map((_, i) => begin.add(
    (minTime + i) * 30, 'minute'
  ).format("HH:mm"));
}

function filterSchedules(allSchedules: {}, wantedPeople: {}) {
  const filteredSchedules = {};

  for (let person in allSchedules) {
    if (wantedPeople.hasOwnProperty(person)) {
      filteredSchedules[person] = allSchedules[person];
    } else {
      filteredSchedules[person] = "0";
    }
  }

  return filteredSchedules
}


export default withRouter(ManageMeetingPage);
