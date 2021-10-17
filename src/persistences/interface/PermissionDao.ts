import { Permission } from "@/models/Permission";

export interface PermissionDao {
  findById: (id: string) => Promise<Permission>;
}
