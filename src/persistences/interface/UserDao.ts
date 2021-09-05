import { User } from "@/models/User";

export interface UserDao {
  get: (id: string) => Promise<User>;
  add: (user: User) => Promise<User>;
}
