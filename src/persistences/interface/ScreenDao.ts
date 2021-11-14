import { Screen } from "@/models/Screen";

export interface ScreenDao {
  findById: (id: string) => Promise<Screen>;
  findAll: () => Promise<Screen[]>;
  edit: (screen: Screen) => Promise<void>;
}
