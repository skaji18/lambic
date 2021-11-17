import { isNotNullish } from "./util";

export class Permission {
  readonly id!: string;
  readonly isAdmin: boolean;

  constructor(init: Partial<Permission>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Permission {
    if (!isNotNullish(data)) {
      return false;
    }
    return typeof data.id === "string" && typeof data.isAdmin === "boolean";
  }
}
