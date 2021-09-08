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
}
