import { firestore } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { PermissionDao } from "../interface/PermissionDao";
import { Permission } from "@/models/Permission";

const isValid = (data: any): data is Permission => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.isAdmin === "boolean")) {
    return false;
  }
  return true;
};

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
    const data = Object.assign(snapshot.data(options), { id: snapshot.id })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new Permission(data);
  },
} as FirestoreDataConverter<Permission>;

const permissions = collection(firestore, "permissions").withConverter(
  converter
);
export class PermissionDaoImpl implements PermissionDao {
  async get(id: string): Promise<Permission> {
    const ref = doc(permissions, id);
    const snap = await getDoc(ref);
    return snap.data();
  }
}
