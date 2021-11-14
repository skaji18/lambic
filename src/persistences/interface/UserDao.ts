import { User } from "@/models/User";

export interface UserDao {
  findById: (id: string) => Promise<User>;
  findAll: () => Promise<User[]>;
  add: (user: User) => Promise<User>;
  edit: (user: User) => Promise<void>;
}
