<template>
  <v-app>
    <v-navigation-drawer v-model="permanent" app fixed>
      <v-app-bar density="compact">
        <img :src="imagePath" class="logo" />
        <div class="text-xs-center ml-1">
          <v-chip
            size="small"
            outline
            color="red"
            class="text-xs-center caption"
            >beta</v-chip
          >
        </div>
      </v-app-bar>

      <v-list dense nav class="mt-10">
        <v-list-item v-if="user === null" @click="goLogin">
          <v-list-item-avatar
            ><v-icon>account_circle</v-icon></v-list-item-avatar
          >
          <v-list-item-title>ログイン</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item v-if="user !== null">
          <v-list-item-title @click="goMyPage">{{
            user.name
          }}</v-list-item-title>
          <v-list-item-subtitle @click="doLogout"
            >ログアウト</v-list-item-subtitle
          >
        </v-list-item>

        <v-divider />

        <v-list-item :to="{ path: '/events' }">
          <v-list-item-avatar><v-icon>view_list</v-icon></v-list-item-avatar>
          <v-list-item-title>イベント一覧</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item :href="href.issues" target="_blank">
          <v-list-item-avatar><v-icon>feedback</v-icon></v-list-item-avatar>
          <v-list-item-title>フィードバック</v-list-item-title>
        </v-list-item>

        <v-divider />

        <template v-if="user && user.isAdmin">
          <v-list-item>
            <strong>管理者メニュー</strong>
          </v-list-item>

          <v-list-item :to="{ name: 'adminScreenList' }">
            <v-list-item-avatar><v-icon>cast</v-icon></v-list-item-avatar>
            <v-list-item-title>スクリーンの設定</v-list-item-title>
          </v-list-item>

          <v-divider />
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="light-green" density="compact">
      <v-app-bar-nav-icon @click="permanent = !permanent" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  data() {
    return {
      permanent: false,
    };
  },
  computed: {
    href() {
      return {
        here: `${window.location.origin}/#${this.$route.path}`,
        issues: process.env.VUE_APP_ISSUES_URL,
      };
    },
    imagePath() {
      return require("@/assets/logo.png");
    },
    user() {
      return this.$store.getters.loginUser || null;
    },
  },
  beforeCreate() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$store.dispatch("login", user);
      }
    });
  },
  methods: {
    // ログイン画面へ遷移
    goLogin() {
      this.$router.push({ path: "/login" });
    },
    // ログアウト処理
    async doLogout() {
      if (confirm("ログアウトしますか？")) {
        await auth.signOut();
        this.$store.dispatch("logout");
      }
    },
    // マイページ画面へ遷移
    goMyPage() {
      this.$router.push({ path: "/myPage" });
    },
  },
};
</script>

<style scoped>
.logo {
  height: 80%;
}
</style>
