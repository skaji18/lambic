<template>
  <v-app>
    <v-navigation-drawer v-model="permanent" app fixed>
      <v-toolbar dense flat>
        <v-list nav class="py-0" style="height: 100%">
          <v-list-item :to="{ path: '/' }" style="height: 100%">
            <img src="@/assets/logo.png" class="logo" />
            <div class="text-xs-center ml-1">
              <v-chip small outlined color="red" class="text-xs-center caption">
                beta
              </v-chip>
            </div>
          </v-list-item>
        </v-list>
      </v-toolbar>

      <v-divider />

      <v-list dense nav>
        <v-list-item v-if="user === null" :to="{ path: '/login' }">
          <v-list-item-avatar>
            <v-icon>account_circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>ログイン</v-list-item-title>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-avatar>
            <img :src="user.photoURL" />
          </v-list-item-avatar>
          <v-list-item-title @click="goMyPage">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-action @click="doLogout">
            <v-btn icon>
              <v-icon>logout</v-icon>
            </v-btn>
          </v-list-item-action>
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

      <qriously id="qrcode" class="pb-4" :value="href.here" :size="150" />
    </v-navigation-drawer>
    <v-app-bar app dense color="light-green">
      <v-app-bar-nav-icon @click="permanent = !permanent"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { UserService } from "@/services/UserService";

export default {
  data() {
    return {
      service: new UserService(),
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
    user() {
      return this.$store.getters.loginUser || null;
    },
  },
  created() {
    this.service.listenAuthState((user) => {
      this.$store.dispatch("login", user);
    });
  },
  methods: {
    async doLogout() {
      if (confirm("ログアウトしますか？")) {
        await this.service.logout();
        await this.$store.dispatch("logout");
      }
    },
    goMyPage() {
      this.$router.push("/myPage");
    },
  },
};
</script>

<style scoped>
#qrcode {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
img {
  object-fit: contain;
}
.logo {
  height: 60%;
}
</style>
