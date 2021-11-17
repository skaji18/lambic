import { Comment } from "@/models/Comment";
import { Observable } from "rxjs";

export interface CommentDao {
  findById: (id: string) => Promise<Comment>;
  findByPresentationId: (presentationId: string) => Promise<Comment[]>;
  listenByPresentationId: (presentationId: string) => Observable<Comment[]>;
  add: (comment: Comment) => Promise<void>;
  edit: (comment: Comment) => Promise<void>;
  remove: (id: string) => Promise<void>;
}
