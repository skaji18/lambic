import { firestore } from "@/firebase";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { sortedChanges } from "rxfire/firestore";
import {
  collection,
  doc,
  increment,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { StampCountDao } from "../interface";
import { Shard, StampCount } from "@/models/StampCount";

const stampCountConverter = {
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
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
    });
    if (!StampCount.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new StampCount(data);
  },
} as FirestoreDataConverter<StampCount>;

const shardConverter = {
  toFirestore(shard: Shard): DocumentData {
    return {
      id: shard.id,
      count: shard.count,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Shard {
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
    });
    if (!Shard.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Shard(data);
  },
} as FirestoreDataConverter<Shard>;

const calcStampCount = (shardChanges): number =>
  shardChanges.reduce((prev, current) => prev + current.doc.data().count, 0);

const stampCounts = collection(firestore, "stampCounts").withConverter(
  stampCountConverter
);
export class StampCountDaoImpl implements StampCountDao {
  async listenByPresentationId(
    presentationId: string
  ): Promise<Observable<StampCount[]>> {
    const snap = await getDocs(
      query(stampCounts, where("presentationId", "==", presentationId))
    );
    return zip(snap.docs.map(this.applyShards));
  }

  private applyShards(
    doc: QueryDocumentSnapshot<StampCount>
  ): Observable<StampCount> {
    const stampCount = doc.data();
    const shards = collection(doc.ref, "shards").withConverter(shardConverter);
    return sortedChanges(shards, {
      events: ["added", "modified"],
    }).pipe(
      map((shardChanges) => {
        stampCount.count = calcStampCount(shardChanges);
        return stampCount;
      })
    );
  }

  async countUp(id: string): Promise<void> {
    const ref = doc(stampCounts, id);
    const stampCount = (await getDoc(ref)).data();
    const shards = collection(ref, "shards").withConverter(shardConverter);
    const shardIdx = Math.floor(
      Math.random() * parseInt(stampCount.shardNum)
    ).toString();
    await updateDoc(doc(shards, shardIdx), {
      count: increment(1),
    });
  }
}
