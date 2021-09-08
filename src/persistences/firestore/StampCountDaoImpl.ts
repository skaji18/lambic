import { firestore } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { StampCountDao } from "../interface";
import { StampCount } from "@/models/StampCount";

const isValid = (data: any): data is StampCount => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.presentationId === "string")) {
    return false;
  }
  if (!(typeof data?.stampId === "string")) {
    return false;
  }
  if (!(typeof data?.shardNum === "string")) {
    return false;
  }
  return true;
};

const converter = {
  toFirestore(stampCount: StampCount): DocumentData {
    return {
      id: stampCount.id,
      presentationId: stampCount.presentationId,
      stampId: stampCount.stampId,
      shardNum: stampCount.shardNum,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): StampCount {
    const postedAt = snapshot.data(options)?.postedAt?.toDate();
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
      postedAt,
    })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new StampCount(data);
  },
} as FirestoreDataConverter<StampCount>;

const stampCounts = collection(firestore, "stampCounts").withConverter(
  converter
);
export class StampCountDaoImpl implements StampCountDao {
  async getAllByPresentationId(
    presentationId: string
  ): Promise<Array<StampCount>> {
    const snap = await getDocs(
      query(stampCounts, where("presentationId", "==", presentationId))
    );
    return snap.docs.map((d) => d.data());
  }
}
