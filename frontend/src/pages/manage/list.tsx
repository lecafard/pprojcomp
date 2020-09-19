import React from "react";

interface ListItemProps {
    id: string,
    name: string,
    location: string
}

function ListItem(props: ListItemProps) {
    return (
        <div>
        <h2> {props.name} - {props.location} </h2>
        guest key: {props.id}
        </div>
    )
}
function ManageListPage() {
    return (<div>

        {JSON.parse(localStorage.getItem("myMeetings"))['meetingsList']
            .map((meeting) => (
                <ListItem id={meeting.id} name={meeting.name} location={meeting.location}/>
              ))}

        </div>)
}

export default ManageListPage;
