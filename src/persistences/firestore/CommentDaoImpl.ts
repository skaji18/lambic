import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { CommentDao } from "../interface";
import { Comment } from "@/models/Comment";
// import { User } from "@/models/User";

const isValid = (data: any): data is Comment => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.presentationId === "string")) {
    return false;
  }
  if (!(typeof data?.comment === "string")) {
    return false;
  }
  if (!(typeof data?.isDirect === "boolean")) {
    return false;
  }
  // if (!(data?.userRef instanceof User)) {
  //   return false;
  // }
  if (!(data?.postedAt instanceof Date)) {
    return false;
  }
  return true;
};

const converter = {
  toFirestore(comment: Comment): DocumentData {
    return {
      id: comment.id,
      presentationId: comment.presentationId,
      userRef: comment.userRef,
      isDirect: comment.isDirect,
      comment: comment.comment,
      postedAt: comment.postedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Comment {
    const postedAt = snapshot.data(options)?.postedAt?.toDate();
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
      postedAt,
    })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new Comment(data);
  },
} as FirestoreDataConverter<Comment>;

const comments = collection(firestore, "comments").withConverter(converter);
export class CommentDaoImpl implements CommentDao {
  async get(id: string): Promise<Comment> {
    const ref = doc(comments, id);
    const snap = await getDoc(ref);
    return snap.data();
  }

  async getAllByPresentationId(
    presentationId: string
  ): Promise<Array<Comment>> {
    const snap = await getDocs(
      query(comments, where("presentationId", "==", presentationId))
    );
    return snap.docs.map((d) => d.data());
  }

  async add(comment: Comment): Promise<Comment> {
    const ref = await addDoc(comments, comment);
    return await this.get(ref.id);
  }

  async edit(comment: Comment): Promise<Comment> {
    const ref = doc(comments, comment.id);
    await updateDoc(ref, comment);
    return await this.get(comment.id);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(comments, id));
  }
}
