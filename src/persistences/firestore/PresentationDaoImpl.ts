import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { PresentationDao } from "../interface/PresentationDao";
import { Presentation } from "@/models/Presentation";
// import { User } from "@/models/User";

const isValid = (data: any): data is Presentation => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.title === "string")) {
    return false;
  }
  if (!(typeof data?.description === "string")) {
    return false;
  }
  // if (!(data?.presenter instanceof User)) {
  //   return false;
  // }
  if (!(typeof data?.isAllowComment === "boolean")) {
    return false;
  }
  return true;
};

const converter = {
  toFirestore(presentation: Presentation): DocumentData {
    return {
      id: presentation.id,
      eventId: presentation.eventId,
      isAdmin: presentation.title,
      description: presentation.description,
      presenter: presentation.presenter,
      isAllowComment: presentation.isAllowComment,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Presentation {
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
    })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new Presentation(data);
  },
} as FirestoreDataConverter<Presentation>;

const presentations = collection(firestore, "presentations").withConverter(
  converter
);
export class PresentationDaoImpl implements PresentationDao {
  async get(id: string): Promise<Presentation> {
    const ref = doc(presentations, id);
    const snap = await getDoc(ref);
    return snap.data();
  }

  async getByEventId(eventId: string): Promise<Array<Presentation>> {
    const snap = await getDocs(
      query(presentations, where("eventId", "==", eventId))
    );
    return snap.docs.map((d) => d.data());
  }
}
