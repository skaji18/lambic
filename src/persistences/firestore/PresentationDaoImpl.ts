import { firestore } from "@/firebase";
import {
  collection,
  doc,
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
import { PresentationDao } from "../interface";
import { Presentation } from "@/models/Presentation";

const converter = {
  toFirestore(presentation: Presentation): DocumentData {
    const presenter = doc(firestore, "users", presentation.getPresenter().id);
    return {
      id: presentation.id,
      eventId: presentation.eventId,
      title: presentation.title,
      description: presentation.description,
      presenter,
      isAllowComment: presentation.isAllowComment,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Presentation {
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
    });
    if (!Presentation.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Presentation(data);
  },
} as FirestoreDataConverter<Presentation>;

const presentations = collection(firestore, "presentations").withConverter(
  converter
);
export class PresentationDaoImpl implements PresentationDao {
  async findById(id: string): Promise<Presentation> {
    const snap = await getDoc(doc(presentations, id));
    return snap.data();
  }

  async findByEventId(eventId: string): Promise<Presentation[]> {
    const snap = await getDocs(
      query(presentations, where("eventId", "==", eventId))
    );
    return snap.docs.map((d) => d.data());
  }

  async edit(presentation: Presentation): Promise<void> {
    await updateDoc(
      doc(presentations, presentation.id),
      presentation.serialize()
    );
  }
}
