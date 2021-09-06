import moment from "moment";

export class Event {
  readonly id!: string;
  title!: string;
  description!: string;
  date!: Date;

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
