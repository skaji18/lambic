export class Permission {
  readonly id!: string;
  readonly isAdmin: boolean;

  constructor(init: Partial<Permission>) {
    Object.assign(this, init);
  }
}
