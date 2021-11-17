import { isNotNullish } from "@/models/util";

export class User {
  readonly id!: string;
  name!: string;
  readonly photoURL!: string;
  isAdmin?: boolean;

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is User {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      typeof data.photoURL === "string"
    );
  }

  serialize?(): unknown {
    return Object.assign({}, this);
  }

  static createDeleted?(): User {
    return new User({
      id: null,
      name: null,
      photoURL: null,
      isAdmin: false,
    });
  }

  isDeleted?(): boolean {
    return this.id == null;
  }
}
