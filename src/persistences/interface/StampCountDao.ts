import { StampCount } from "@/models/StampCount";

export interface StampCountDao {
  getAllByPresentationId: (
    presentationId: string
  ) => Promise<Array<StampCount>>;
}
