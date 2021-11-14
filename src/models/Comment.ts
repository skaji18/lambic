import { isNotNullish } from "./util";
import { User } from "./User";
import { Presentation } from "./Presentation";

export class Comment {
  readonly id!: string;
  readonly presentationId!: string;
  userRef!: Pick<User, "id">;
  comment!: string;
  isDirect!: boolean;
  postedAt!: Date;

  private user?: User;
  presentation?: Presentation;

  constructor(init: Partial<Comment>) {
    Object.assign(this, init);
  }

  static canDeserialize?(data: unknown): data is Comment {
    if (!isNotNullish(data)) {
      return false;
    }
    return (
      typeof data.id === "string" &&
      typeof data.presentationId === "string" &&
      typeof data.comment === "string" &&
      typeof data.isDirect === "boolean" &&
      // && data.userRef instanceof User
      data.postedAt instanceof Date
    );
  }

  serialize?(): unknown {
    const result = Object.assign({}, this);
    delete result.user;
    delete result.presentation;
    return result;
  }

  static create?(data: Partial<Comment>): Comment {
    const entity = new Comment(data);
    entity.postedAt = new Date();
    return entity;
  }

  getCommenter?(): User {
    return this.user || User.createDeleted();
  }

  setCommenter?(user: User): void {
    this.user = user;
  }

  isCommentedBy?(user: User): boolean {
    return this.userRef.id === user.id;
  }

  canShowBy?(user: User): boolean {
    // 管理者はすべてのコメントを確認できる
    if (user.isAdmin) {
      return true;
    }
    // 発表者はすべてのコメントを確認できる
    if (this.presentation.isPresentedBy(user)) {
      return true;
    }
    // コメントしたユーザー自身はコメントを確認できる
    if (this.isCommentedBy(user)) {
      return true;
    }
    // その他のユーザーは公開コメントであれば確認できる
    return !this.isDirect;
  }

  canEdit?(user: User): boolean {
    return this.isCommentedBy(user);
  }

  canDelete?(user: User): boolean {
    // 管理者はすべてのコメントを削除できる
    if (user.isAdmin) {
      return true;
    }
    return this.isCommentedBy(user);
  }
}
