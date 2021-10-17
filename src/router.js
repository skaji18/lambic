import Vue from "vue";
import Router from "vue-router";
import { store } from "./store";
import Error from "@/components/Error.vue";
import Login from "@/components/Login.vue";
import MyPage from "./views/MyPage.vue";
import { EventDetail, EventList } from "@/components/pages/event";
import {
  EditPresentation,
  PresentationDetail,
} from "@/components/pages/presentation";
import AdminScreenSetting from "./views/AdminScreenSetting.vue";
import AdminScreenList from "./views/AdminScreenList.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/events",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/myPage",
      name: "myPage",
      component: MyPage,
    },
    {
      path: "/events/:id",
      name: "eventDetail",
      component: EventDetail,
      props: true,
    },
    {
      path: "/events",
      name: "eventList",
      component: EventList,
    },
    {
      path: "/events/:eventId/presentations/new",
      name: "newPresentation",
      component: EditPresentation,
      props: true,
    },
    {
      path: "/events/:eventId/presentations/:id/edit",
      name: "editPresentation",
      component: EditPresentation,
      props: true,
    },
    {
      path: "/events/:eventId/presentations/:id",
      name: "presentationDetail",
      component: PresentationDetail,
      props: true,
    },
    {
      path: "/screens",
      name: "adminScreenList",
      component: AdminScreenList,
      meta: { needsAdmin: true },
    },
    {
      path: "/screens/:id",
      name: "adminScreenSetting",
      component: AdminScreenSetting,
      props: true,
      meta: { needsAdmin: true },
    },
    {
      path: "/error",
      name: "error",
      component: Error,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],

  /*
   * 画面表示変更時、スクロール位置を一番上にする
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

/*
 * ナビゲーションガード
 * ルーティングの前処理を行う
 */
router.beforeEach((to, from, next) => {
  const user = store.getters.loginUser;
  // 権限による表示制御
  if (
    to.matched.some((record) => record.meta.needsAdmin) &&
    (user === null || !user.isAdmin)
  ) {
    // 権限がない場合はエラーページへ遷移
    next({ name: "error" });
  } else {
    next();
  }
});

export default router;
