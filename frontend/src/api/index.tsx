import wretch, { Wretcher } from "wretch";
import { Meeting, APIResponse, AuthedSchedule } from "./schemas";
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

  public getAuthedGuest(key: string, name: string, password: string): Promise<APIResponse<AuthedSchedule>> {
    return this.wrapper.url(`/guest/${key}/auth`)
      .post({
        auth: {
          name,
          password
        }
      })
      .unauthorized(() => {throw "Unauthorized"})
      .json();
  }

  public updateAuthedGuest(key: string, name: string, password: string, data: AuthedSchedule) {
    return this.wrapper.url(`/guest/${key}/schedule`)
      .post({
        auth: {
          name,
          password
        },
        ...data
      })
      .unauthorized(() => {throw "Unauthorized"})
      .json();
  }

  public getEventByOwnerKey(key: string): Promise<APIResponse<Meeting>> {
    return this.wrapper.url(`/owner/${key}`)
      .get()
      .json();
  }
}

export default new API();
