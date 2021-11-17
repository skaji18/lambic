import { Presentation } from "@/models/Presentation";

export interface PresentationDao {
  findById: (id: string) => Promise<Presentation>;
  findByEventId: (eventId: string) => Promise<Presentation[]>;
  edit: (presentation: Partial<Presentation>) => Promise<void>;
}
