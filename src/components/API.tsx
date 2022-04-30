import axios from 'axios'

import {
  UserData,
  NewUserData,
  EventData,
  NewEventData
} from './Type'

export const baseUrl = 'https://calendar-scheduler-server.herokuapp.com/'

export const getUserData = async (): Promise<UserData[]> => {
  const res = await axios.get(`${baseUrl}/user`)
    .then((r) => r.data)
  return res['users']
}

export const addUserData = async (newUserData: NewUserData) => {
  await axios.post(`${baseUrl}/user`, newUserData)
}

export const updateUserData = async (newUserData: UserData) => {
  await axios.put(`${baseUrl}/user`, newUserData)
}

export const deleteUserData = async (id: number) => {
  await axios.delete(`${baseUrl}/user/${id}`)
}

export const getEvent = async (year: number, month: number, day: number, days: number): Promise<EventData[][]> => {
  return await axios.get(`${baseUrl}/event/${year}/${month}/${day}`, {
    params: {days: days}
  })
    .then((r) => r.data)
    .then((r) => r['events'])
}

export const addEvent = async (event: NewEventData) => {
  await axios.post(`${baseUrl}/event`, event)
}

export const updateEvent = async (event: EventData) => {
  await axios.put(`${baseUrl}/event`, event)
}

export const deleteEvent = async (eventId: number) => {
  await axios.delete(`${baseUrl}/event/${eventId}`)
}
