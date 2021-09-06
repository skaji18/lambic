import { Event } from "@/models/Event";

export interface EventDao {
  get: (id: string) => Promise<Event>;
  getAll: () => Promise<Array<Event>>;
}
