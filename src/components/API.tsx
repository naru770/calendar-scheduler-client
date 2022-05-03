import { supabase } from '../libs/supabase'

import {
  UserData,
  NewUserData,
  EventData,
  NewEventData
} from './Type'


export const fetchUserData = async (): Promise<UserData[]> => {
  const { data } = await supabase
    .from('user')
    .select('*')
  return data as UserData[]
}

export const createUserData = async (user: NewUserData) => {
  const { data, error } = await supabase
    .from('user')
    .insert(user)
}

export const modifyUserData = async (user: UserData) => {
  const { data, error } = await supabase
    .from('user')
    .update(user)
    .match({id: user.id})
}

export const deleteUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('user')
    .delete()
    .match({id: userId})
}

export const zeroPadding = (num: number | string, digit: number): string => ('0'.repeat(digit) + num).slice(-1 * digit)
export const toDateString = (datetime: Date) => {
  const dateString = datetime.getFullYear() + '-'
  + zeroPadding(datetime.getMonth() + 1, 2) + '-'
  + zeroPadding(datetime.getDate(), 2)
  return dateString
}

export const fetchEvent = async (year: number, month: number, day: number, days: number): Promise<EventData[]> => {

  const startDate = new Date(year, month - 1, day)  // Date
  const endDate = new Date(startDate.getTime() + days * 86400 * 1000)

  const startDateString = toDateString(startDate)
  const endDateString = toDateString(endDate)

  const { data, error } = await supabase
    .from('event')
    .select('*')
    .gte('start_date', startDateString)
    .lte('start_date', endDateString)
  
  return data as EventData[]
}

export const createEvent = async (event: NewEventData) => {
  const { data, error } = await supabase
    .from('event')
    .insert(event)
}

export const modifyEvent = async (event: EventData) => {
  const { data, error } = await supabase
    .from('event')
    .update(event)
    .match({id: event.id})
}

export const deleteEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event')
    .delete()
    .match({id: eventId})
}
