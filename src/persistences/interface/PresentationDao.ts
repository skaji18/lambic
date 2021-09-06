import { Presentation } from "@/models/Presentation";

export interface PresentationDao {
  get: (id: string) => Promise<Presentation>;
  getByEventId: (eventId: string) => Promise<Array<Presentation>>;
}
