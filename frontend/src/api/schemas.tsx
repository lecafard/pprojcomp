export interface Meeting {
    name: string;
    location: string;
    private: boolean;
    allow_registration: boolean;
    guest_key?: string;
    owner_key?: string;
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