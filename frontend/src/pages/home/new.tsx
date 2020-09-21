import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DAYS, DAY_SECONDS, SLOT_LENGTH } from "../../constants";
import api from "../../api";
import { Meeting } from "../../api/schemas";
import dayjs from "dayjs";
import { RouteComponentProps, withRouter } from "react-router-dom";

function New({history}: RouteComponentProps) {
    const { handleSubmit, register, watch, errors } = useForm();
    const onSubmit = (values: any) => {
        const meeting: Meeting = {
            name: values.name,
            location: values.location,
            options: {
                type: values.options.type,
                min_time: parseInt(values.options.minTime),
                max_time: parseInt(values.options.maxTime),
            },
            private: !!values.private,
            allow_registration: !!values.allowRegistration
        };

        if (meeting.options.type === "day") {
            meeting.options.days = values.options.days.map((v) => v ? "1" : 0).join("");
        }
        api.newMeeting(meeting)
            .then((data) => {
                history.push(`/s/${data.data.owner_key}`);
            })
            .catch((e) => {
                console.error(e);
            });
    };
    
    const type = watch("options[type]");

    return (<>
    <h1 className="is-center">Create a New Meeting</h1>
    
    {Object.keys(errors).length ? (
        <blockquote style={{
            backgroundColor: "var(--color-error)"
        }}>
            An error occurred
        </blockquote>
    ) : null}
    
    <form onSubmit={handleSubmit(onSubmit)}>
        <p>
            <label>Name</label>
            <input
                name="name"
                ref={register}
                required
            />
        </p>
        <p>
            <label>Location</label>
            <input
                name="location"
                ref={register}
                required
            />
        </p>
        
        <label>Time from:</label>
        <select name="options[minTime]" ref={register()}>
            {Array.from(Array((DAY_SECONDS/SLOT_LENGTH)).keys()).map((v) => {
                const time = dayjs().startOf('day').add((v)*SLOT_LENGTH, 'second');
                return (
                    <option key={v} value={v}>
                        {`${time.hour().toString().padStart(2, '0')}:`+
                        `${time.minute().toString().padStart(2, '0')}`}
                    </option>
                )
            })}
        </select>
        
        <label>Time to:</label>
        <select name="options[maxTime]" ref={register()}>
            {Array.from(Array((DAY_SECONDS/SLOT_LENGTH)).keys()).map((v) => {
                const time = dayjs().startOf('day').add((v+1)*SLOT_LENGTH, 'second');
                return (
                    <option key={v+1} value={v+1}>
                        {`${time.hour().toString().padStart(2, '0')}:`+
                        `${time.minute().toString().padStart(2, '0')}`+
                        `${time.day() != dayjs().day() ? ' +1' : ''}`}
                    </option>
                )
            })}
        </select>

        <div className="grouped">
            <label>Type:</label>
            <ul style={{listStyleType: "none"}}>
                <li>
                    <input
                        name="options[type]"
                        type="radio"
                        value="day"
                        ref={register}
                        required
                    />
                    <label>Days of the week</label>
                </li>
                <li>
                    <input
                        name="options[type]"
                        type="radio"
                        value="date"
                        ref={register}
                        required
                    />
                    <label>Certain dates</label>
                </li>
            </ul>
        </div>

        { type === "day" ? (<div>
            {DAYS.map((day, i) => (<span key={i}>
                <label>{day.substr(0,3)}</label>
                <input type="checkbox" ref={register()} name={`options[days][${i}]`} />
            </span>))}
        </div>) : null }
        { type === "date" ? "date" : null }

        <p>
            <label>
                <input
                    name="private"
                    type="checkbox"
                    value="day"
                    ref={register()}
                />
                Private
            </label><br />

            <label>
            <input
                    name="allowRegistration"
                    type="checkbox"
                    value="day"
                    ref={register()}
                />
                Allow Registration
            </label>
        </p>

        <button type="submit">Create!</button>
    </form></>);
}

export default withRouter(New);