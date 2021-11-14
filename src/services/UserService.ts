import { autoInjectable, inject } from "tsyringe";

import type { UserDao, PermissionDao } from "@/persistences/interface";
import { User } from "@/models/User";

// TODO: firebase の知識が入り込んでいるので、認証用の interface に切り出す
import type { User as AuthUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, login, logout } from "@/firebase";
type CallbackFunction = (value: User) => void;

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
    return await this.userDao.findById(id);
  }

  listenAuthState(callback: CallbackFunction): void {
    onAuthStateChanged(auth, async (user: AuthUser) => {
      if (!user?.uid) {
        return;
      }
      const persistedUser = await this.get(user.uid);
      const permission = await this.permissionDao.findById(persistedUser.id);
      persistedUser.isAdmin = permission.isAdmin;
      callback(persistedUser);
    });
  }

  async login(): Promise<User> {
    const user = await this._login();
    const permission = await this.permissionDao.findById(user.id);
    user.isAdmin = permission.isAdmin;
    return user;
  }

  private async _login(): Promise<User> {
    const authUser = (await login()).user;
    const persistedUser = await this.get(authUser.uid);
    return persistedUser || this.register(authUser);
  }

  async logout(): Promise<void> {
    await logout();
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

  async edit(user: User): Promise<void> {
    await this.userDao.edit(user);
  }
}
