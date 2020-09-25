import React from "react";
import style from "./style.module.css";

interface ListItemProps {
    id: string,
    name: string,
    location: string,
    type: "guest" | "manager"
}

function ListItem(props: ListItemProps) {
    return (
        <div className={`${style["list-item"]}`}>
        <div className={`${style.title}`}> {props.type === "manager" ? "○" : ""} {props.name} </div>
        <div className={`${style.title2}`}> {props.location} </div>
        {props.type === "guest" ? "Guest key: " : "Owner key: "} {props.id}
        </div>
    )
}
function ManageListPage() {
  const managedMeetings = JSON.parse(localStorage.getItem("managedMeetings"));
  const guestMeetings = JSON.parse(localStorage.getItem("myMeetings"))

  return (    
    <div className={` ${style.view}`}>
      <div className="container">
        {managedMeetings ? managedMeetings["meetingsList"]
          .map((meeting) => (
            <a href={`/s/${meeting.id}`}>
              <ListItem id={meeting.id} name={meeting.name} location={meeting.location} type="manager"/>
            </a>
          ))
        : null}

        {guestMeetings ? guestMeetings["meetingsList"]
          .map((meeting) => (
            <a href={`/g/${meeting.id}`}>
              <ListItem id={meeting.id} name={meeting.name} location={meeting.location} type="guest"/>
            </a>
          ))
        : null}

      </div>
    </div>
  )
}

export default ManageListPage;
