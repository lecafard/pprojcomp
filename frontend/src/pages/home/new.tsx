import React from "react";

function New() {
    return (<>
    <h1 className="is-center">Create a New Meeting</h1>
    <form>
        {/* TODO: link form up to logic */}
        <p>
            <label>Name</label>
            <input name="name" />
        </p>
        <p>
            <label>Location</label>
            <input name="location" />
        </p>
        <p className="grouped">
            <label>Type: </label>
            <ul style={{listStyleType: "none"}}>
                <li>
                    <input name="type" type="radio" value="day" />
                    <label>Days of the week</label>
                </li>
                <li>
                    <input name="type" type="radio" value="date" />
                    <label>Certain dates</label>
                </li>
            </ul>
        </p>

        {/* TODO: add day selector/ date selector components */}

        <button type="submit">Create!</button>
    </form></>);
}

export default New;