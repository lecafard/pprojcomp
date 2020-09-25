import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import ReadOnlySchedule from "../../components/schedule/read_only_schedule";
import { Meeting, Auth } from '../../api/schemas';
import api from '../../api';
import { constructDays, constructTimes } from "../../utilities";

import style from "./style.module.css";

function ManageMeetingPage({ match: { params: { id } } }: RouteComponentProps<{ id?: string }>) {
  const [eventDetails, setEventDetails] = useState<Meeting | null>(null);
  const [people, setPeople] = useState<string[]>([]);
  const [auth, setAuth] = useState<Auth>({
    name: "",
    password: ""
  });

  useEffect(() => {
    handleLoad(setPeople);
  }, [id]);

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();

    api.createGuestManage(id, auth.name, auth.password)
      .then(() => {
        setAuth({
          name: "",
          password: ""
        });
        handleLoad();
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleLoad = async (peopleFunction?: (people: string[]) => void) => {
    api.getEventByOwnerKey(id)
      .then((data) => {
        setEventDetails(data.data);
        peopleFunction && peopleFunction(getNames(data.data));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getNames = (details: Meeting) => {
    return Array.from(new Set(Object.keys(details.schedules)
      .concat(Object.keys(details.notes))));
  }

  const handleDelete = (name) => {
    if (!window.confirm(`Do you want to delete ${name}?`)) return;

    const newP = getNames(eventDetails).filter((n) => n !== name);
    setPeople(people.filter((n) => n !== name));
    setEventDetails({
      ...eventDetails,
      schedules: newP.reduce((obj, x) => Object.assign(obj, { [x]: eventDetails.schedules[x] }), {}),
      notes: newP.reduce((obj, x) => Object.assign(obj, { [x]: eventDetails.notes[x] }), {}),
    });
  }

  if (!eventDetails) return null;

  return (
    <div className={`${style.view}`}  style={{overflowY: "scroll"}}>
      <div className="container">
        <div className={`${style.eventDetails}`}>
          <h2>{eventDetails.name}</h2>
          <div>
            <h4>{eventDetails.location}</h4>
            <p>Share this code with your guests: <a href={`/g/${eventDetails.guest_key}`}>{eventDetails.guest_key}</a></p>
          </div>
        </div>

        <div className={`row`}>
          <div className="col" style={{overflowX: "scroll", display: "flex"}}>
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
          <div className="col">
            <button onClick={() => handleLoad(() => {})} className={`bg-primary text-white ${style.actions}`}>
              Refresh
            </button>
            <button onClick={() => setPeople(Object.keys(eventDetails.schedules))} className={`${style.actions}`}>
              Show all
            </button>
            <button onClick={() => setPeople([])} className={`${style.actions}`}>
              Hide all
            </button>
            {!eventDetails.allow_registration && <div>
              <h3 className="is-center">Create a user</h3>
              <form onSubmit={handleCreateUser}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={(name: ChangeEvent<HTMLInputElement>) => setAuth({
                    ...auth,
                    name: name.target.value
                  })}/>
                <label>Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  onChange={(password: ChangeEvent<HTMLInputElement>) => setAuth({
                    ...auth,
                    password: password.target.value
                  })}
                />
                <br />

                <button type="submit" className="button bg-success text-white is-center">
                  Submit
                </button>
              </form>
            </div>}
            
            <ul className={`${style["list"]}`}>
              {getNames(eventDetails).map(name => {
                return (
                  <li className={`${style["list-item"]} ${style.title}`}
                    key={name}
                  >
                    {name}
                    <br/>
                    <p className={`${style["notes"]}`}>{eventDetails.notes[name] ? eventDetails.notes[name] : "No notes"}</p>
                    <br/>
                    <p
                      className={`${style["toggle"]}`}
                      onClick={() => handleDelete(name)}
                    >
                      {"Delete"}
                    </p>
                    <p
                      className={`${style["toggle"]}`}
                      onClick={() => setPeople(
                        people.includes(name) ?
                        people.filter((n) => n !== name) :
                        [...people, name]
                      )}
                    >
                      {!people.includes(name) ? "Show" : "Hide"}
                    </p>
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
