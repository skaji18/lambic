import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { ScreenDao } from "../interface";
import { Screen } from "@/models/Screen";

const converter = {
  toFirestore(screen: Screen): DocumentData {
    return {
      id: screen.id,
      name: screen.name,
      displayPresentationRef: screen.displayPresentationRef,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Screen {
    const data = Object.assign(snapshot.data(options), { id: snapshot.id });
    if (!Screen.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Screen(data);
  },
} as FirestoreDataConverter<Screen>;

const screens = collection(firestore, "screens").withConverter(converter);
export class ScreenDaoImpl implements ScreenDao {
  async findById(id: string): Promise<Screen> {
    const snap = await getDoc(doc(screens, id));
    return snap.data();
  }

  async findAll(): Promise<Screen[]> {
    const snap = await getDocs(screens);
    return snap.docs.map((d) => d.data());
  }

  async edit(screen: Screen): Promise<void> {
    const presentationId = screen.getPresentation()?.id;
    screen.displayPresentationRef = presentationId
      ? doc(firestore, "presentations", presentationId)
      : null;
    await updateDoc(doc(screens, screen.id), screen.serialize());
  }
}
