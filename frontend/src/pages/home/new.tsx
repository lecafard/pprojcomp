import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MeetingOptions, MeetingType } from "../../api/schemas";
import style from "./style.module.css";

function New() {
    const { handleSubmit, register, watch, errors } = useForm();
    const onSubmit = (values: any) => console.log(values);
    
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
        { type === "day" ? "day" : null }
        { type === "date" ? "date" : null }
        <p>
            <label>
                <input
                    name="options[private]"
                    type="checkbox"
                    value="day"
                    ref={register()}
                />
                Private
            </label><br />

            <label>
            <input
                    name="options[allow_registration]"
                    type="checkbox"
                    value="day"
                    ref={register()}
                />
                Allow Registration
            </label>
        </p>

        {/* TODO: add day selector/ date selector components */}

        <button type="submit">Create!</button>
    </form></>);
}

export default New;