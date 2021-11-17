import { autoInjectable, inject } from "tsyringe";
import { Screen } from "@/models/Screen";
import type {
  ScreenDao,
  PresentationDao,
  UserDao,
} from "@/persistences/interface";

@autoInjectable()
export class ScreenService {
  private screenDao!: ScreenDao;
  private presentationDao!: PresentationDao;
  private userDao!: UserDao;

  constructor(
    @inject("ScreenDao") screenDao?: ScreenDao,
    @inject("PresentationDao") presentationDao?: PresentationDao,
    @inject("UserDao") userDao?: UserDao
  ) {
    this.screenDao = screenDao;
    this.presentationDao = presentationDao;
    this.userDao = userDao;
  }

  async getAll(): Promise<Screen[]> {
    return await this.screenDao.findAll();
  }

  async get(id: string): Promise<Screen> {
    const screen = await this.screenDao.findById(id);
    const presentationId = screen.displayPresentationRef?.id;
    if (presentationId) {
      const presentation = await this.presentationDao.findById(presentationId);
      const users = await this.userDao.findAll();
      presentation.setPresenter(
        users.find((u) => presentation.isPresentedBy(u))
      );
      screen.setPresentation(presentation);
    }
    return screen;
  }

  async edit(screen: Partial<Screen>): Promise<void> {
    await this.screenDao.edit(new Screen(screen));
  }
}
