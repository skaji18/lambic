import { autoInjectable, inject } from "tsyringe";
import { Presentation } from "@/models/Presentation";
import { Comment } from "@/models/Comment";
import type {
  EventDao,
  UserDao,
  PresentationDao,
  CommentDao,
  StampDao,
  StampCountDao,
} from "@/persistences/interface";

@autoInjectable()
export class PresentationService {
  private presentationDao!: PresentationDao;
  private eventDao!: EventDao;
  private userDao!: UserDao;
  private commentDao!: CommentDao;
  private stampDao!: StampDao;
  private stampCountDao!: StampCountDao;

  constructor(
    @inject("PresentationDao") presentationDao?: PresentationDao,
    @inject("EventDao") eventDao?: EventDao,
    @inject("UserDao") userDao?: UserDao,
    @inject("CommentDao") commentDao?: CommentDao,
    @inject("StampDao") stampDao?: StampDao,
    @inject("StampCountDao") stampCountDao?: StampCountDao
  ) {
    this.presentationDao = presentationDao;
    this.eventDao = eventDao;
    this.userDao = userDao;
    this.commentDao = commentDao;
    this.stampDao = stampDao;
    this.stampCountDao = stampCountDao;
  }

  async get(id: string): Promise<Presentation> {
    const presentation = await this.presentationDao.get(id);
    presentation.event = await this.eventDao.get(presentation.eventId);
    presentation.comments = await this.commentDao.getAllByPresentationId(
      presentation.id
    );
    const users = await this.userDao.getAll();
    presentation.comments.forEach((c) => {
      c.presentation = presentation;
      c.userRef = users.find((u) => u.id === c.userRef.id) || {
        photoURL: null,
        name: null,
      };
    });
    presentation.stamps = await this.stampDao.getAll();
    presentation.stampCounts = await this.stampCountDao.getAllByPresentationId(
      presentation.id
    );
    return presentation;
  }

  async appendComment(comment: Partial<Comment>): Promise<void> {
    await this.commentDao.edit(comment);
  }

  async editComment(comment: Comment): Promise<void> {
    await this.commentDao.edit(comment);
  }

  async removeComment(comment: Comment): Promise<void> {
    await this.commentDao.remove(comment.id);
  }
}
