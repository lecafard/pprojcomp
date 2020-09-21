import React, { useState } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import { APIResponse, Meeting } from "../../api/schemas";

function Guest({ history }: RouteComponentProps) {
  const [guestKey, setGuestKey] = useState('');
  const [ownerKey, setOwnerKey] = useState('');
  const [error, setError] = useState('');

  function handleChange(fn: React.Dispatch<React.SetStateAction<string>>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      fn(e.target.value);
    }
  }

  function checkCode(type: string) {
    return function (e: React.FormEvent) {
      e.preventDefault();
      if (type == 'm') {
        api.getEventByOwnerKey(ownerKey)
          .then(() => {
            history.push(`/m/${ownerKey}`);
          })
          .catch(() => {
            setError("Manager key is not valid");
          });
      } else {
        api.getEventByGuestKey(guestKey)
          .then(() => {
            history.push(`/g/${guestKey}`);
          })
          .catch(() => {
            setError("Guest key is not valid");
          });
      }
    }
  }

  return (<>
    <h1 className="is-center">Have a Guest or Manager Code?</h1>
    {error ? (
      <blockquote style={{
        backgroundColor: "var(--color-error)"
      }}>
        {error}
      </blockquote>
    ) : null}
    <form onSubmit={checkCode('g')}>
      <p>
        <label>Guest Code</label>
        <input name="name" value={guestKey} required onChange={handleChange(setGuestKey)} />
      </p>

      <button type="submit" className="button is-info">
        Join!
            </button>
    </form>
    <form onSubmit={checkCode('m')}>
      <p>
        <label>Manager Code</label>
        <input name="name" value={ownerKey} required onChange={handleChange(setOwnerKey)} />
      </p>

      <button type="submit" className="button is-info">
        Join!
        </button>
    </form>
  </>);
}
export default withRouter(Guest);
