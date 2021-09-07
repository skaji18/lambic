import { User } from "@/models/User";

export interface UserDao {
  get: (id: string) => Promise<User>;
  getAll: () => Promise<Array<User>>;
  add: (user: User) => Promise<User>;
}
