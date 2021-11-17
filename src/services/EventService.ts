import { autoInjectable, inject } from "tsyringe";
import { Event } from "@/models/Event";
import type {
  EventDao,
  UserDao,
  PresentationDao,
} from "@/persistences/interface";
import moment from "moment";

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

  async getAll(): Promise<Event[]> {
    return (await this.eventDao.findAll()).sort((a, b) => {
      const base = moment(a.date);
      if (base.isSame(b.date)) {
        return 0;
      }
      return base.isAfter(b.date) ? -1 : 1;
    });
  }

  async get(id: string): Promise<Event> {
    const event = await this.eventDao.findById(id);
    event.presentations = await this.presentationDao.findByEventId(id);
    const users = await this.userDao.findAll();
    event.presentations.forEach((p) => {
      p.setPresenter(users.find((u) => p.isPresentedBy(u)));
    });
    return event;
  }
}
