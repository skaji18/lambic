import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vuetify/dist/vuetify.min.css";
// import './registerServiceWorker'
import firebase from "firebase/app";
import FirebaseConfig from "@/../firebase-config.json";
import store from "../store";

firebase.initializeApp(FirebaseConfig);

createApp(App).use(router).use(store).use(createVuetify()).mount("#app");
