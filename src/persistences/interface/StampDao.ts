import { Stamp } from "@/models/Stamp";

export interface StampDao {
  findAll: () => Promise<Stamp[]>;
}
