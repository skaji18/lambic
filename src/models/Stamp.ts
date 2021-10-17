import { isNotNullish } from "@/models/util";

export class Stamp {
  readonly id!: string;
  order!: number;
  canUse!: boolean;
  fullPath!: string;
  src!: string;
  string!: string;

  constructor(init: Partial<Stamp>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Stamp {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.order === "number" &&
      typeof data.canUse === "boolean" &&
      typeof data.fullPath === "string" &&
      typeof data.src === "string" &&
      typeof data.string === "string"
    );
  }
}
