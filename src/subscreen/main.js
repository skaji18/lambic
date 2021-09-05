import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify/lib/entry-bundler";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vuetify/dist/vuetify.min.css";
// import './registerServiceWorker'
import { store } from "../store";

createApp(App).use(router).use(store).use(createVuetify()).mount("#app");
