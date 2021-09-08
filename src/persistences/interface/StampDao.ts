import { Stamp } from "@/models/Stamp";

export interface StampDao {
  getAll: () => Promise<Array<Stamp>>;
}
