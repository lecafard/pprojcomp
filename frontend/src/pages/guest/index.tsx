import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { ReadOnlySchedule, SubmitSchedule } from '../../components/schedule';

import style from "./style.module.css";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import api from '../../api';
import { DAYS } from '../../constants';

function ErrorBox(props: any) {
  return (
    <div className={`container ${style.errorBox}`}>
      <h3> {props.code} :( </h3>
    </div>
  )
}

function GuestPage({ match: { params: { id } } }: RouteComponentProps<{ id?: string }>) {
  const [eventDetails, setEventDetails] = useState({} as any);
  const [userSelectedTimes, setUserSelectedTimes] = useState(null);
  const [clearTimes, setClearTimes] = useState(false);

  useEffect(() => {
    (async () => {
      api.getEventByGuestKey(id)
        .then((data) => setEventDetails(data.data))
        .catch((e) => {
          console.error(e);
        });
    })();
  }, []);

  useEffect(() => {
    if (eventDetails) {
      let thisMeeting = {
        "id": eventDetails.guest_key,
        "name": eventDetails.name,
        "location": eventDetails.location
      }
      let arr = JSON.parse(localStorage.getItem("myMeetings"))
      if (arr === null) {
        localStorage.setItem("myMeetings", JSON.stringify({ "meetingsList": [thisMeeting] }));
      } else {
        arr['meetingsList'] = arr['meetingsList'].filter((x) => x.id !== eventDetails.guest_key)
        arr['meetingsList'].push(thisMeeting)
        localStorage.setItem("myMeetings", JSON.stringify({ "meetingsList": arr['meetingsList'] }));
      }
      console.log(localStorage.getItem("myMeetings"))
    }
  }, [eventDetails])

  if (!eventDetails) {
    return (
      <ErrorBox code={"Couldn't find meeting " + id} />
    )
  };

  return (
    <div className={` ${style.view}`}>
      <div className="container">
        <div className={` ${style.eventDetails}`}>
          <h3>
            {eventDetails.name}
          </h3>
          <h4>
            {eventDetails.location}
          </h4>
        </div>

        <div className={`row`}>
          <div className={`col`} style={{ display: "flex" }}>
            <div className="container">
              <div className="row">
                <h3 className="is-center">
                  Select your availability
                </h3>
              </div>
              <div className="row is-center">
                <SubmitSchedule
                  dates={eventDetails.data.options.type === "day" ?
                          constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                  }
                  times={constructTimes(eventDetails.data.options["min_time"], eventDetails.data.options["max_time"])}
                  timeHandler={setUserSelectedTimes}
                  clearDates={clearTimes}
                />
              </div>
              <div className="row is-right" style={{marginTop: "20px"}}>
                <button className="button bg-error text-white" onClick={() => setClearTimes(!clearTimes)}>Clear</button>
                <button className="button bg-success text-white">Submit</button>
              </div>
            </div>
          </div>

          <div className={`col`} style={{height: "100%"}}>
            <div className="container">
              <div className="row">
                <h3 className="is-center">
                  Group availability
                </h3>
              </div>
              <div className="row is-center">
                <ReadOnlySchedule
                  dates={eventDetails.data.options.type === "day" ?
                          constructDays(eventDetails.data.options.dates) : eventDetails.data.options.dates
                  }
                  times={constructTimes(eventDetails.data.options["min_time"], eventDetails.data.options["max_time"])}
                  userSelectedTimes={userSelectedTimes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function constructDays(days: Array<string>) {
  return DAYS.filter((_, i) => days[i] === "1");
}

function constructTimes(minTime: number, maxTime: number) {
  const times = [dayjs().hour(0).minute(0)];
  for (let i = 1; i < maxTime; i++) {
    times.push(times[i - 1].add(30, "minute"));
  }

  return times.slice(minTime);
}

function createDateString(selectedDays: Array<any>) {
  const days = selectedDays[0].length;
  const times = selectedDays.length;

  let dateString = "";

  for (let day = 1; day < days; day++) {
    for (let time = 1; time < times; time++) {
      dateString += selectedDays[time][day];
    }
  }

  return dateString;
}

export default withRouter(GuestPage);
