import { User } from "./User";
import { Event } from "./Event";
import { Comment } from "./Comment";
import { Stamp } from "./Stamp";
import { StampCount } from "./StampCount";
import { isNotNullish } from "./util";

export class Presentation {
  readonly id!: string;
  eventId!: string;
  title!: string;
  description!: string;
  presenter!: Pick<User, "id">;
  isAllowComment!: boolean;

  event?: Event;
  comments?: Comment[];
  stamps?: Stamp[];
  stampCounts?: StampCount[];
  private user!: User;

  constructor(init: Partial<Presentation>) {
    Object.assign(this, init);
    this.comments = [];
    this.stamps = [];
    this.stampCounts = [];
  }

  static canDeserialize?(data: unknown): data is Presentation {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.description === "string" &&
      isNotNullish(data.presenter) &&
      typeof data.presenter.id === "string" &&
      typeof data.isAllowComment === "boolean"
    );
  }

  serialize?(): unknown {
    const result = Object.assign({}, this);
    delete result.event;
    delete result.comments;
    delete result.stamps;
    delete result.stampCounts;
    delete result.user;
    return result;
  }

  static create?(data: Partial<Presentation>): Presentation {
    data.description = data.description || "";
    return new Presentation(data);
  }

  getPresenter(): User {
    return this.user || User.createDeleted();
  }

  setPresenter(user: User): void {
    this.user = user;
  }

  isPresentedBy(user: User): boolean {
    return this.presenter.id === user.id;
  }

  canEditBy(user: User): boolean {
    return this.isPresentedBy(user);
  }

  getStampCount(stampId: string): number {
    return this.stampCounts.find((sc) => sc.stampId === stampId)?.count;
  }

  isEnabledStamp(stampId: string): boolean {
    const stamp = this.stamps.find((s) => s.id === stampId);
    return stamp.canUse && this.getStampCount(stampId) !== undefined;
  }
}
