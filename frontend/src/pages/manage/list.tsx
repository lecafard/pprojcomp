import React from "react";
import style from "./style.module.css";
import { Link } from "react-router-dom";

interface ListItemProps {
    id: string,
    name: string,
    location: string
}

function ListItem(props: ListItemProps) {
    return (
        <div className={`${style.listItem}`}>
        <div className={`${style.title}`}> {props.name} </div>
        <div className={`${style.title2}`}> {props.location} </div>
        guest key: {props.id}
        </div>
    )
}
function ManageListPage() {
    return (<div className={` ${style.view}`}>
        {JSON.parse(localStorage.getItem("myMeetings"))['meetingsList']
          .map((meeting) => (
            <a href={`/g/${meeting.id}`}>
              <ListItem id={meeting.id} name={meeting.name} location={meeting.location}/>
            </a>
          ))
        }

        </div>)
}

export default ManageListPage;
