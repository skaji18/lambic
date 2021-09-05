import { firestore } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { UserDao } from "../interface/UserDao";
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
    const data = Object.assign(snapshot.data(options), { id: snapshot.id })!;
    console.log(data);
    if (!User.isValid(data)) {
      throw new Error("invalid data");
    }
    return new User(data);
  },
} as FirestoreDataConverter<User>;

const users = collection(firestore, "users").withConverter(converter);
export class UserDaoImpl implements UserDao {
  async get(id: string): Promise<User> {
    const ref = doc(users, id);
    const snap = await getDoc(ref);
    return snap.data();
  }

  async add(user: User): Promise<User> {
    return this.get(user.id);
  }
}
