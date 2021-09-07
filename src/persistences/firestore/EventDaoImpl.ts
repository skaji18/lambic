import { firestore } from "@/firebase";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from "firebase/firestore";
import { EventDao } from "../interface/EventDao";
import { Event } from "@/models/Event";

const isValid = (data: any): data is Event => {
  if (!(typeof data?.id === "string")) {
    return false;
  }
  if (!(typeof data?.title === "string")) {
    return false;
  }
  if (!(typeof data?.description === "string")) {
    return false;
  }
  if (!(data?.date instanceof Date)) {
    return false;
  }
  return true;
};

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
    const date = snapshot.data(options)?.date?.toDate();
    const data = Object.assign(snapshot.data(options), {
      id: snapshot.id,
      date,
    })!;
    if (!isValid(data)) {
      throw new Error("invalid data");
    }
    return new Event(data);
  },
} as FirestoreDataConverter<Event>;

const events = collection(firestore, "events").withConverter(converter);
export class EventDaoImpl implements EventDao {
  async get(id: string): Promise<Event> {
    const ref = doc(events, id);
    const snap = await getDoc(ref);
    return snap.data();
  }

  async getAll(): Promise<Array<Event>> {
    const snap = await getDocs(query(events));
    return snap.docs.map((d) => d.data());
  }
}
