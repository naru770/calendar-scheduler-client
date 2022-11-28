export interface CalendarMonth {
  year: number;
  month: number;
}

export interface CalendarDate extends CalendarMonth {
  day: number;
}

export interface NewEventData {
  user_id: string;
  content: string;
  start_date: string;
  start_time: string;
  is_timed: boolean;
}

export interface EventData extends NewEventData {
  id: string;
}

export interface NewUserData {
  name: string;
  color: string;
}

export interface UserData extends NewUserData {
  id: string;
}
