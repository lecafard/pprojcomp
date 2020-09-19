import React, {useState} from "react";
import { Link } from "react-router-dom";

function Guest() {
    const [inputValue, setInputValue] = useState<string>('');

    function handleChange(e: any) {
        setInputValue(e.target.value)
    }

    return (<>
    <h1 className="is-center">Have a Guest Code?</h1>
    <form>
        <p>
            <label>Guest Code</label>
            <input name="name" value={inputValue} onChange={handleChange}/>
        </p>

        <Link to={inputValue ? `/g/${inputValue}` : '/'}>
            <button type="submit" className="button is-info">
                Join!
            </button>
       </Link>
    </form></>);
}

export default Guest;
