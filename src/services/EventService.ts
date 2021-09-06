import { autoInjectable, inject } from "tsyringe";
import { Event } from "@/models/Event";
import type {
  EventDao,
  UserDao,
  PresentationDao,
} from "@/persistences/interface";

@autoInjectable()
export class EventService {
  private eventDao!: EventDao;
  private userDao!: UserDao;
  private presentationDao!: PresentationDao;

  constructor(
    @inject("EventDao") eventDao?: EventDao,
    @inject("UserDao") userDao?: UserDao,
    @inject("PresentationDao") presentationDao?: PresentationDao
  ) {
    this.eventDao = eventDao;
    this.userDao = userDao;
    this.presentationDao = presentationDao;
  }

  async getAll(): Promise<Array<Event>> {
    return this.eventDao.getAll();
  }

  async get(id: string): Promise<Event> {
    const event = await this.eventDao.get(id);
    event.presentations = await this.presentationDao.getByEventId(id);
    const users = await this.userDao.getAll();
    event.presentations.forEach((p) => {
      p.presenter = users.find((u) => u.id === p.presenter.id);
    });
    return event;
  }
}
