import { User } from "@/models/User";
import { Presentation } from "@/models/Presentation";

export class Comment {
  readonly id!: string;
  readonly presentationId!: string;
  userRef!: Partial<User>;
  comment!: string;
  isDirect!: boolean;
  postedAt!: Date;
  presentation?: Presentation;

  constructor(init: Partial<Comment>) {
    Object.assign(this, init);
  }

  private isCommentedBy?(user: User): boolean {
    return this.userRef.id === user.id;
  }

  canShowBy?(user: User): boolean {
    // 管理者はすべてのコメントを確認できる
    if (user.isAdmin) {
      return true;
    }
    // 発表者はすべてのコメントを確認できる
    if (this.presentation.presenter.id === user.id) {
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
