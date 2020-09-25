import React from "react"

import style from "./style.module.css";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
    return (<nav className={`nav ${style.navbar}`}>
        <div className="nav-left">
            <Link to="/" className={`brand ${style.logo}`}>I Can't Believe It's Not W2M!</Link>
        </div>
        <div className="nav-right">
            <div className="tabs">
                <NavLink to="/s">My Meetings</NavLink>
            </div>
        </div>
    </nav>);
}

export default Navbar;
