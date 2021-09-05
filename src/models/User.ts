export class User {
  readonly id!: string;
  name!: string;
  readonly photoURL!: string;
  isAdmin?: boolean;

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }

  static isValid?(data: any): data is User {
    if (!(typeof data?.id === "string")) {
      return false;
    }
    if (!(typeof data?.name === "string")) {
      return false;
    }
    if (!(typeof data?.photoURL === "string")) {
      return false;
    }
    return true;
  }
}
