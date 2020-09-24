export interface Meeting {
  name: string;
  location: string;
  private: boolean;
  allow_registration: boolean;
  guest_key?: string;
  owner_key?: string;
  schedules?: {[key: string]: string};
  notes?: {[key: string]: string};
  options: MeetingOptions;
}

export type MeetingType = "day" | "date";

export interface MeetingOptions {
  type: MeetingType;
  dates?: string[];
  days?: string;
  min_time: number;
  max_time: number;
}

export interface Auth {
  name: string;
  password: string;
}

export interface AuthedSchedule {
  notes?: string;
  schedule?: string;
}

export interface APIResponse<T> {
  success: boolean;
  error?: any;
  data: T;
}
