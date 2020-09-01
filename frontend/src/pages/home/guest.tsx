import React from "react";

function Guest() {
    return (<>
    <h1 className="is-center">Have a Guest Code?</h1>
    <form>
        {/* TODO: link form up to logic */}
        <p>
            <label>Guest Code</label>
            <input name="name" />
        </p>
        <button type="submit">Join!</button>
    </form></>);
}

export default Guest;