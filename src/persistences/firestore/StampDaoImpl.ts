import { firestore } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { StampDao } from "../interface";
import { Stamp } from "@/models/Stamp";

const isValid = (data: any): data is Stamp => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.order === "number")) {
    return false;
  }
  if (!(typeof data?.canUse === "boolean")) {
    return false;
  }
  if (!(typeof data?.fullPath === "string")) {
    return false;
  }
  if (!(typeof data?.src === "string")) {
    return false;
  }
  if (!(typeof data?.string === "string")) {
    return false;
  }
  return true;
};

const converter = {
  toFirestore(stamp: Stamp): DocumentData {
    return {
      id: stamp.id,
      order: stamp.order,
      canUse: stamp.canUse,
      fullPath: stamp.fullPath,
      src: stamp.src,
      string: stamp.string,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Stamp {
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
    })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new Stamp(data);
  },
} as FirestoreDataConverter<Stamp>;

const stamps = collection(firestore, "stamps").withConverter(converter);
export class StampDaoImpl implements StampDao {
  async getAll(): Promise<Array<Stamp>> {
    const snap = await getDocs(query(stamps, orderBy("order")));
    return snap.docs.map((d) => d.data());
  }
}
