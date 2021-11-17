import { firestore } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { UserDao } from "../interface";
import { User } from "@/models/User";

const converter = {
  toFirestore(user: User): DocumentData {
    return {
      id: user.id,
      name: user.name,
      photoURL: user.photoURL,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = Object.assign(snapshot.data(options), { id: snapshot.id });
    if (!User.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new User(data);
  },
} as FirestoreDataConverter<User>;

const users = collection(firestore, "users").withConverter(converter);
export class UserDaoImpl implements UserDao {
  async findById(id: string): Promise<User> {
    const snap = await getDoc(doc(users, id));
    return snap.data();
  }

  async findAll(): Promise<User[]> {
    const snap = await getDocs(query(users));
    return snap.docs.map((d) => d.data());
  }

  async add(user: User): Promise<User> {
    const ref = await addDoc(users, user);
    return this.findById(ref.id);
  }

  async edit(user: User): Promise<void> {
    await updateDoc(doc(users, user.id), user.serialize());
  }
}
