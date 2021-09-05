import { Permission } from "@/models/Permission";

export interface PermissionDao {
  get: (id: string) => Promise<Permission>;
}
