import { api } from "@/lib/api";


export function useReminder() {
  const createReminder = async (
    email: string,
    title: string,
    dueDate: string
  ) => {
    const resp = await api.createReminder(email, title, dueDate);
    return resp;
  };
  const getReminders = async (email: string) => {
    const resp = await api.getReminders(email);
    return resp;
  };

  return { createReminder, getReminders };
}