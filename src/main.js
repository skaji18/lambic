import "reflect-metadata";
import "@/persistences/firestore/tsyringe";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { createVuetify } from "vuetify/lib/entry-bundler";
import moment from "moment";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vuetify/dist/vuetify.min.css";
// import './registerServiceWorker'

moment.locale("ja", {
  weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
});

createApp(App).use(router).use(store).use(createVuetify()).mount("#app");
