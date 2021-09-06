import { container } from "tsyringe";
import { UserDaoImpl } from "./UserDaoImpl";
import { PermissionDaoImpl } from "@/persistences/firestore/PermissionDaoImpl";
import { EventDaoImpl } from "@/persistences/firestore/EventDaoImpl";

// DIコンテナへの登録
container.register("UserDao", { useClass: UserDaoImpl });
container.register("PermissionDao", { useClass: PermissionDaoImpl });
container.register("EventDao", { useClass: EventDaoImpl });
