import wretch, { Wretcher } from "wretch";
import { Meeting, APIResponse } from "./schemas";
class API {
    private wrapper: Wretcher = wretch().url("/api");

    public newMeeting(meeting: Meeting): Promise<APIResponse<Meeting>> {
        return this.wrapper.url("/owner/new")
            .post(meeting)
            .json();
    }

    public getEventByGuestKey(key: string): Promise<APIResponse<Meeting>> {
        return this.wrapper.url(`/guest/${key}`)
            .get()
            .json();
    }

    public getEventByOwnerKey(key: string): Promise<APIResponse<Meeting>> {
        return this.wrapper.url(`/owner/${key}`)
            .get()
            .json();
    }
}


export default new API();