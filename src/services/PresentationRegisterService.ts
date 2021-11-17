// FIXME: writeBatch をうまく抽象化して扱えないのでfirestore依存の処理になっている。
import { autoInjectable, inject } from "tsyringe";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { Presentation } from "@/models/Presentation";
import { StampCount } from "@/models/StampCount";
import type { PresentationDao, StampDao } from "@/persistences/interface";

@autoInjectable()
export class PresentationRegisterServiceImpl {
  private presentationDao!: PresentationDao;
  private stampDao!: StampDao;

  constructor(
    @inject("PresentationDao") presentationDao?: PresentationDao,
    @inject("StampDao") stampDao?: StampDao
  ) {
    this.presentationDao = presentationDao;
    this.stampDao = stampDao;
  }

  async append(presentation: Partial<Presentation>): Promise<void> {
    const batch = writeBatch(firestore);

    const newRef = doc(collection(firestore, "presentations"));
    const data = presentation.serialize();
    Object.assign(data, {
      presenter: doc(firestore, "users", presentation.getPresenter().id),
    });
    batch.set(newRef, data);

    const maxShardNum = process.env.VUE_APP_STAMP_COUNT_SHARD_NUM;
    (await this.stampDao.findAll())
      .filter((s) => s.canUse)
      .forEach((s) => {
        const stampCount = new StampCount({
          presentationId: newRef.id,
          stampId: s.id,
          shardNum: maxShardNum,
        });
        const ref = doc(collection(firestore, "stampCounts"));
        batch.set(ref, stampCount.serialize());

        for (let idx = 0; idx < maxShardNum; idx++) {
          batch.set(doc(collection(ref, "shards"), idx.toString()), {
            count: 0,
          });
        }
      });

    await batch.commit();
  }

  async edit(presentation: Partial<Presentation>): Promise<void> {
    await this.presentationDao.edit(presentation);
  }

  async delete(presentation: Partial<Presentation>): Promise<void> {
    const batch = writeBatch(firestore);

    const stampCountRefs = (
      await getDocs(
        query(
          collection(firestore, "stampCounts"),
          where("presentationId", "==", presentation.id)
        )
      )
    ).docs;
    stampCountRefs.forEach((sc) => {
      const shardNum = sc.data().shardNum;
      for (let idx = 0; idx < shardNum; idx++) {
        batch.delete(doc(collection(sc.ref, "shards"), idx.toString()));
      }
      batch.delete(sc.ref);
    });

    batch.delete(doc(collection(firestore, "presentations"), presentation.id));

    await batch.commit();
  }
}
