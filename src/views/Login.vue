<template>
  <div>
    <v-layout justify-center>
      <v-card-title>
        <h1 class="headline mb-0">ログイン</h1>
      </v-card-title>
    </v-layout>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import { auth, authUI, uiConfig } from '@/firebase'

export default {
  mounted () {
    authUI.start('#firebaseui-auth-container', uiConfig)
  },
  beforeCreate () {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // ユーザ情報をセット
        this.$store.dispatch('login', user)
      }
    })
  }
}
</script>
