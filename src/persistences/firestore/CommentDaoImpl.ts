import { Observable } from "rxjs";
import { collectionData } from "rxfire/firestore";
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

const converter = {
  toFirestore(comment: Comment): DocumentData {
    return {
      id: comment.id,
      presentationId: comment.presentationId,
      userRef: doc(firestore, "users", comment.getCommenter().id),
      isDirect: comment.isDirect,
      comment: comment.comment,
      postedAt: comment.postedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Comment {
    const snapData = snapshot.data(options);
    const postedAt = snapData?.postedAt?.toDate();
    const data = Object.assign(snapData, {
      id: snapshot.id,
      postedAt,
    });
    if (!Comment.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Comment(data);
  },
} as FirestoreDataConverter<Comment>;

const comments = collection(firestore, "comments").withConverter(converter);
export class CommentDaoImpl implements CommentDao {
  async findById(id: string): Promise<Comment> {
    const ref = doc(comments, id);
    const snap = await getDoc(ref);
    return snap.data();
  }

  async findByPresentationId(presentationId: string): Promise<Comment[]> {
    const snap = await getDocs(
      query(comments, where("presentationId", "==", presentationId))
    );
    return snap.docs.map((doc) => doc.data());
  }

  listenByPresentationId(presentationId: string): Observable<Comment[]> {
    return collectionData(
      query(comments, where("presentationId", "==", presentationId))
    );
  }

  async add(comment: Comment): Promise<void> {
    await addDoc(comments, comment);
  }

  async edit(comment: Comment): Promise<void> {
    await updateDoc(doc(comments, comment.id), comment.serialize());
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(comments, id));
  }
}
