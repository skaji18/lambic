import { createRouter } from "vue-router";
import ScreenSelect from "./views/ScreenSelect.vue";
import SubScreen from "./views/SubScreen.vue";

export default createRouter({
  routes: [
    {
      path: "/",
      name: "screen-select",
      component: ScreenSelect,
    },
    {
      path: "/:id",
      name: "subscreen",
      component: SubScreen,
      props: true,
    },
  ],
});
