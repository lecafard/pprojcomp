import React, {useState} from "react";
import { Link } from "react-router-dom";

function Guest() {
    const [inputValue, setInputValue] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);


    async function handleChange(e: any) {
        (async function check (n) {
            setInputValue(n)
            let r = await fetch(`/api/guest/${n}`)
            if (r.status === 200) {
                setSuccess(true)
            } else {
                setSuccess(false)
                console.log("no meeting with id ", n)
            }
        })(e.target.value)
    }

    return (<>
    <h1 className="is-center">Have a Guest Code?</h1>
    <form>
        <p>
            <label>Guest Code</label>
            <input name="name" onChange={handleChange}/>
        </p>

        <Link to={success ? `/g/${inputValue}` : '/'}>
         <button type={success ? "submit" : "button"}>
              Join!
         </button>
       </Link>
    </form></>);
}

export default Guest;
