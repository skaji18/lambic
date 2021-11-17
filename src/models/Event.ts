import moment from "moment";
import { Presentation } from "./Presentation";
import { isNotNullish } from "./util";

export class Event {
  readonly id!: string;
  title!: string;
  description!: string;
  date!: Date;
  presentations?: Presentation[];

  constructor(init: Partial<Event>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Event {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.description === "string" &&
      data.date instanceof Date
    );
  }

  isFinished?(now: Date): boolean {
    return moment(this.date).isBefore(now, "day");
  }

  isToday?(now: Date): boolean {
    return moment(this.date).isSame(now, "day");
  }
}
