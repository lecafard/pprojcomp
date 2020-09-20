import wretch, { Wretcher } from "wretch";
import { Meeting } from "./schemas";
class API {
    private wrapper: Wretcher = wretch().url("/api");

    public async newMeeting(meeting: Meeting) {
        return await this.wrapper.url("/owner/new")
            .post(meeting);
    }
}


export default new API();