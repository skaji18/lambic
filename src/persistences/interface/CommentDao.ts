import { Comment } from "@/models/Comment";

export interface CommentDao {
  get: (id: string) => Promise<Comment>;
  getAllByPresentationId: (presentationId: string) => Promise<Array<Comment>>;
  add: (comment: Comment) => Promise<Comment>;
  edit: (comment: Comment) => Promise<Comment>;
  remove: (id: string) => Promise<void>;
}
