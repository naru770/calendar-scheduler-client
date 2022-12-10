import { supabase } from "../libs/supabase";
import { UserData, NewUserData, EventData, NewEventData } from "./Type";
import { DateTime } from "luxon";

export const fetchUserData = async (): Promise<UserData[]> => {
  const { data } = await supabase.from("user").select("*");
  return data as UserData[];
};

export const createUserData = async (user: NewUserData) => {
  const { data, error } = await supabase.from("user").insert(user);
};

export const modifyUserData = async (user: UserData) => {
  const { data, error } = await supabase
    .from("user")
    .update(user)
    .match({ id: user.id });
};

export const deleteUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from("user")
    .delete()
    .match({ id: userId });
};

export const toDateString = (date: DateTime) => date.toFormat("yyyy-MM-dd");

export const fetchEvent = async (
  year: number,
  month: number,
  day: number,
  days: number
): Promise<EventData[]> => {
  const startDate = DateTime.local(year, month, day);
  const endDate = startDate.plus({ days: days });
  const startDateString = toDateString(startDate);
  const endDateString = toDateString(endDate);
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .gte("start_date", startDateString)
    .lte("start_date", endDateString);

  return data as EventData[];
};

export const createEvent = async (event: NewEventData) => {
  await supabase.from("event").insert(event);
};

export const modifyEvent = async (event: EventData) => {
  await supabase.from("event").update(event).match({ id: event.id });
};

export const deleteEvent = async (eventId: string) => {
  await supabase.from("event").delete().match({ id: eventId });
};
