import { autoInjectable, inject } from "tsyringe";

import type { UserDao } from "@/persistences/interface/UserDao";
import { User } from "@/models/User";
import type { PermissionDao } from "@/persistences/interface/PermissionDao";

// TODO: firebase の知識が入り込んでいるので、認証用の interface に切り出す
import type { User as AuthUser } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, authProvider } from "@/firebase";

const login = () => signInWithPopup(auth, authProvider);

@autoInjectable()
export class UserService {
  private userDao!: UserDao;
  private permissionDao!: PermissionDao;

  constructor(
    @inject("UserDao") userDao?: UserDao,
    @inject("PermissionDao") permissionDao?: PermissionDao
  ) {
    this.userDao = userDao;
    this.permissionDao = permissionDao;
  }

  private async get(id: string): Promise<User | null> {
    return await this.userDao.get(id);
  }

  async login(): Promise<User> {
    const user = await this._login();
    const permission = await this.permissionDao.get(user.id);
    user.isAdmin = permission.isAdmin;
    return user;
  }

  private async _login(): Promise<User> {
    const authUser = (await login()).user;
    const persistedUser = await this.get(authUser.uid);
    return persistedUser || this.register(authUser);
  }

  private async register(authUser: AuthUser): Promise<User> {
    const name =
      authUser.displayName ||
      authUser.email.substr(0, authUser.email.indexOf("@"));
    return await this.userDao.add({
      id: authUser.uid,
      name,
      photoURL: authUser.photoURL,
      isAdmin: false,
    });
  }
}
