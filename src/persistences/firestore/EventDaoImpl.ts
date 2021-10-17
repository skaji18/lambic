import { firestore } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { EventDao } from "../interface";
import { Event } from "@/models/Event";

const converter = {
  toFirestore(event: Event): DocumentData {
    return {
      id: event.id,
      isAdmin: event.title,
      description: event.description,
      date: event.date,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Event {
    const snapData = snapshot.data(options);
    const date = snapData?.date?.toDate();
    const data = Object.assign(snapData, {
      id: snapshot.id,
      date,
    });
    if (!Event.canDeserialize(data)) {
      throw new Error("invalid data");
    }
    return new Event(data);
  },
} as FirestoreDataConverter<Event>;

const events = collection(firestore, "events").withConverter(converter);
export class EventDaoImpl implements EventDao {
  async findById(id: string): Promise<Event> {
    const snap = await getDoc(doc(events, id));
    return snap.data();
  }

  async findAll(): Promise<Event[]> {
    const snap = await getDocs(events);
    return snap.docs.map((d) => d.data());
  }
}
