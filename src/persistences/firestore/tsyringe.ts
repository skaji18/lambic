import { container } from "tsyringe";
import { UserDaoImpl } from "./UserDaoImpl";
import { PermissionDaoImpl } from "@/persistences/firestore/PermissionDaoImpl";
import { EventDaoImpl } from "@/persistences/firestore/EventDaoImpl";
import { PresentationDaoImpl } from "@/persistences/firestore/PresentationDaoImpl";

// DIコンテナへの登録
container.register("UserDao", { useClass: UserDaoImpl });
container.register("PermissionDao", { useClass: PermissionDaoImpl });
container.register("EventDao", { useClass: EventDaoImpl });
container.register("PresentationDao", { useClass: PresentationDaoImpl });
