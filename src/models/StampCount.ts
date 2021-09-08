export class StampCount {
  readonly id!: string;
  presentationId!: string;
  stampId!: string;
  shardNum!: string;
  count?: number;

  constructor(init: Partial<StampCount>) {
    Object.assign(this, init);
  }
}
