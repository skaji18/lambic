import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { Comment } from "@/models/Comment";
import { Stamp } from "@/models/Stamp";
import { StampCount } from "@/models/StampCount";

export class Presentation {
  readonly id!: string;
  eventId!: string;
  title!: string;
  description!: string;
  presenter!: User;
  isAllowComment!: boolean;
  event?: Event;
  comments?: Array<Comment>;
  stamps?: Array<Stamp>;
  stampCounts?: Array<StampCount>;

  constructor(init: Partial<Presentation>) {
    Object.assign(this, init);
  }

  getStampCount(stampId: string): number {
    return this.stampCounts.find((sc) => sc.stampId === stampId)?.count || 0;
  }
}
