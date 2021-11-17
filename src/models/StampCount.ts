import { isNotNullish } from "./util";

export class StampCount {
  readonly id!: string;
  presentationId!: string;
  stampId!: string;
  shardNum!: string;
  count?: number;

  constructor(init: Partial<StampCount>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is StampCount {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.presentationId === "string" &&
      typeof data.stampId === "string" &&
      typeof data.shardNum === "string"
    );
  }

  serialize?(): unknown {
    const result = Object.assign({}, this);
    delete result.count;
    return result;
  }
}

export class Shard {
  readonly id!: string;
  count!: number;

  constructor(init: Partial<Shard>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Shard {
    if (!isNotNullish(data)) {
      return false;
    }
    return typeof data.id === "string" && typeof data.count === "number";
  }
}
