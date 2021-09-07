import { User } from "@/models/User";

export class Presentation {
  readonly id!: string;
  eventId!: string;
  title!: string;
  description!: string;
  presenter!: User;
  isAllowComment!: boolean;

  constructor(init: Partial<Presentation>) {
    Object.assign(this, init);
  }
}
