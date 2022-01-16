<template>
  <v-app>
    <v-navigation-drawer app fixed v-model="permanent">
      <v-toolbar dense flat>
        <v-list-item dense @click="goHome">
          <img :src="imagePath">
          <div class="text-center ml-1">
            <v-chip small outlined color="red" class="text-center text-caption">beta</v-chip>
          </div>
        </v-list-item>
      </v-toolbar>
      <v-divider />
      <v-list dense class="pt-0">
        <v-list-item dense v-if="user" class="my-2">
          <button type="button" @click="goMyPage">
            <v-list-item-avatar>
              <img v-bind:src="user.photoURL">
            </v-list-item-avatar>
          </button>
          <v-list-item-content>
            <v-list-item-title @click="goMyPage" id="userName">
              <button type="button">{{ user.name }}</button>
            </v-list-item-title>
            <v-list-item-subtitle>
              <button type="button" @click="doLogout">ログアウト</button>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense v-else class="my-2">
          <v-list-item-avatar>
            <v-icon x-large color="light-green">account_circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title id="userName">ゲストユーザ</v-list-item-title>
            <v-list-item-subtitle>
              <button type="button" @click="goLogin">ログイン</button>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item dense :to="{ path: '/events' }">
          <v-list-item-action>
            <v-icon>view_list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>イベント一覧</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          :href="href.issues"
          target="_blank">
          <v-list-item-action>
            <v-icon>feedback</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>フィードバック</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />

        <template v-if="user && user.isAdmin">
          <v-list-item>
            <strong>管理者メニュー</strong>
          </v-list-item>
          <v-list-item :to="{name: 'adminScreenList' }">
            <v-list-item-action>
              <v-icon>cast</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>スクリーンの設定</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <qriously id="qrcode" class="pb-4" :value="href.here" :size="150"/>
    </v-navigation-drawer>
    <v-app-bar app dense color="light-green">
      <v-app-bar-nav-icon @click="permanent = !permanent"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      permanent: false
    }
  },
  computed: {
    imagePath () {
      return require('@/assets/logo.png')
    },
    href () {
      return {
        here: `${window.location.origin}/#${this.$route.path}`,
        issues: process.env.VUE_APP_ISSUES_URL
      }
    },
    user () {
      return this.$store.getters.user
    }
  },
  beforeCreate () {
    firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          // ユーザ情報をセット
          this.$store.dispatch('login', user)
        }
      })
    this.$store.dispatch('initStore')
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    // ログイン画面へ遷移
    goLogin () {
      this.$router.push({ path: '/login' })
    },
    // ログアウト処理
    doLogout () {
      if (confirm('ログアウトしますか？')) {
        firebase.auth().signOut().catch(function (error) {
          console.log(error)
        })
        this.$store.dispatch('logout')
      }
    },
    // マイページ画面へ遷移
    goMyPage () {
      this.$router.push({ path: '/myPage' })
    }
  }
}
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
    width: 70%;
}
</style>
