import { Observable, of } from "rxjs";
import { combineLatestWith, map } from "rxjs/operators";
import { autoInjectable, inject } from "tsyringe";
import { Presentation } from "@/models/Presentation";
import { Comment } from "@/models/Comment";
import { StampCount } from "@/models/StampCount";
import type {
  EventDao,
  UserDao,
  PresentationDao,
  CommentDao,
  StampDao,
  StampCountDao,
} from "@/persistences/interface";
import moment from "moment";

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
    const presentation = await this.presentationDao.findById(id);
    presentation.event = await this.eventDao.findById(presentation.eventId);
    presentation.comments = await this.commentDao.findByPresentationId(
      presentation.id
    );
    const users = await this.userDao.findAll();
    presentation.comments.forEach((c) => {
      c.presentation = presentation;
      c.setCommenter(users.find((u) => c.isCommentedBy(u)));
    });
    return presentation;
  }

  async appendComment(comment: Partial<Comment>): Promise<void> {
    await this.commentDao.add(Comment.create(comment));
  }

  async editComment(comment: Comment): Promise<void> {
    await this.commentDao.edit(comment);
  }

  async removeComment(comment: Comment): Promise<void> {
    await this.commentDao.remove(comment.id);
  }

  async countUp(stampCount: StampCount): Promise<void> {
    await this.stampCountDao.countUp(stampCount.id);
  }

  async observe(id: string): Promise<Observable<Presentation>> {
    const presentation = await this.presentationDao.findById(id);
    presentation.event = await this.eventDao.findById(presentation.eventId);
    presentation.stamps = await this.stampDao.findAll();

    const users = await this.userDao.findAll();
    presentation.setPresenter(users.find((u) => presentation.isPresentedBy(u)));

    const stampCountObserver = await this.stampCountDao.listenByPresentationId(
      id
    );
    return of(presentation)
      .pipe(
        combineLatestWith(this.commentDao.listenByPresentationId(id), of(users))
      )
      .pipe(map(applyComments))
      .pipe(combineLatestWith(stampCountObserver))
      .pipe(map(applyStampCount));
  }
}

const applyComments = ([presentation, comments, users]): Presentation => {
  presentation.comments = comments
    .sort((a, b) => {
      const base = moment(a.postedAt);
      if (base.isSame(b.postedAt)) {
        return 0;
      }
      return base.isAfter(b.postedAt) ? -1 : 1;
    })
    .map((c) => {
      c.presentation = presentation;
      c.setCommenter(users.find((u) => c.isCommentedBy(u)));
      return c;
    });
  return presentation;
};

const applyStampCount = ([presentation, stampCounts]): Presentation => {
  presentation.stampCounts = stampCounts;
  return presentation;
};
