import { StampCount } from "@/models/StampCount";
import { Observable } from "rxjs";

export interface StampCountDao {
  listenByPresentationId: (
    presentationId: string
  ) => Promise<Observable<StampCount[]>>;
  countUp: (id: string) => Promise<void>;
}
