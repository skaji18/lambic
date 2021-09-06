import moment from "moment";
import { Presentation } from "@/models/Presentation";

export class Event {
  readonly id!: string;
  title!: string;
  description!: string;
  date!: Date;
  presentations?: Array<Presentation>;

  constructor(init: Partial<Event>) {
    Object.assign(this, init);
  }

  isFinished?(now: Date): boolean {
    return moment(this.date).isBefore(now, "day");
  }

  isToday?(now: Date): boolean {
    return moment(this.date).isSame(now, "day");
  }
}
