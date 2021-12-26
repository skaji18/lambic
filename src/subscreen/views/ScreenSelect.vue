<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Select Screen</v-toolbar-title>
    </v-app-bar>
    <v-progress-linear v-if="isLoadong" indeterminate></v-progress-linear>
    <v-content v-else>
      <v-container fluid>
        <v-layout row>
          <v-flex v-if="screens.length === 0" class="display-1">会場がありません。</v-flex>
          <v-flex v-else>
            <v-list>
              <v-list-item v-for="screen in screens" :key="screen.id" :to="{ path: screen.id }">
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{ screen.name || '（名称未設定の会場）' }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  name: 'select-subscreen',
  data () {
    return {
      isLoadong: true,
      screens: []
    }
  },
  created () {
    const firestore = firebase.firestore()
    const screensRef = firestore.collection('screens')
    screensRef
      .get()
      .then((querySnapshot) => {
        const screens = []
        querySnapshot.forEach((doc) => {
          const d = doc.data()
          screens.push({
            id: doc.id,
            ...d
          })
        })
        this.screens = screens
        this.isLoadong = false
      }).catch((error) => {
        console.log('Error getting collection:', error)
      })
  }
}
</script>
