export interface CalendarMonth {
  year: number,
  month: number,
  }

export interface CalendarDate extends CalendarMonth {
  day: number,
}

export interface EventData {
  id: number,
  content: string,
  user_id: number,
  start_datetime: string,
  is_timed: boolean,
}

export interface NewEventData {
  content: string,
  user_id: number,
  start_datetime: string,
  is_timed: boolean,
}

export interface UserData {
  id: number,
  name: string,
  color: string,
}

export interface NewUserData {
  name: string,
  color: string,
}