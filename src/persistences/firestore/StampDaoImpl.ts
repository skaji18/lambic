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
    });
    if (!Stamp.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Stamp(data);
  },
} as FirestoreDataConverter<Stamp>;

const stamps = collection(firestore, "stamps").withConverter(converter);
export class StampDaoImpl implements StampDao {
  async findAll(): Promise<Stamp[]> {
    const snap = await getDocs(query(stamps, orderBy("order")));
    return snap.docs.map((d) => d.data());
  }
}
