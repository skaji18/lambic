import { firestore } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { PermissionDao } from "../interface";
import { Permission } from "@/models/Permission";

const converter = {
  toFirestore(permission: Permission): DocumentData {
    return {
      id: permission.id,
      isAdmin: permission.isAdmin,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Permission {
    const data = Object.assign(snapshot.data(options), { id: snapshot.id });
    if (!Permission.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Permission(data);
  },
} as FirestoreDataConverter<Permission>;

const permissions = collection(firestore, "permissions").withConverter(
  converter
);
export class PermissionDaoImpl implements PermissionDao {
  async findById(id: string): Promise<Permission> {
    const snap = await getDoc(doc(permissions, id));
    return snap.data();
  }
}
