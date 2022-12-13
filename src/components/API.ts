import { supabase } from "../libs/supabase";
import { UserData, NewUserData, EventData, NewEventData } from "./Type";
import { DateTime } from "luxon";

export const isToday = (date: DateTime): Boolean => {
  const today = DateTime.now();
  return (
    date.year === today.year &&
    date.month === today.month &&
    date.day === today.day
  );
};

export const toDateString = (date: DateTime) => date.toFormat("yyyy-MM-dd");

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

export const fetchEvent = async (
  firstDay: DateTime,
  days: number
): Promise<EventData[]> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .gte("start_date", toDateString(firstDay))
    .lte("start_date", toDateString(firstDay.plus({ days: days })));

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
