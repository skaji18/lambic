import { container } from "tsyringe";
import { UserDaoImpl } from "./UserDaoImpl";
import { PermissionDaoImpl } from "./PermissionDaoImpl";
import { EventDaoImpl } from "./EventDaoImpl";
import { PresentationDaoImpl } from "./PresentationDaoImpl";
import { CommentDaoImpl } from "./CommentDaoImpl";
import { StampDaoImpl } from "./StampDaoImpl";
import { StampCountDaoImpl } from "./StampCountDaoImpl";

// DIコンテナへの登録
container.register("UserDao", { useClass: UserDaoImpl });
container.register("PermissionDao", { useClass: PermissionDaoImpl });
container.register("EventDao", { useClass: EventDaoImpl });
container.register("PresentationDao", { useClass: PresentationDaoImpl });
container.register("CommentDao", { useClass: CommentDaoImpl });
container.register("StampDao", { useClass: StampDaoImpl });
container.register("StampCountDao", { useClass: StampCountDaoImpl });
