import { autoInjectable, inject } from "tsyringe";
import { Event } from "@/models/Event";
import type { EventDao } from "@/persistences/interface/EventDao";

@autoInjectable()
export class EventService {
  private eventDao!: EventDao;

  constructor(@inject("EventDao") eventDao?: EventDao) {
    this.eventDao = eventDao;
  }

  async getAll(): Promise<Array<Event>> {
    return this.eventDao.getAll();
  }
}
