import { Event } from "@/models/Event";

export interface EventDao {
  findById: (id: string) => Promise<Event>;
  findAll: () => Promise<Event[]>;
}
