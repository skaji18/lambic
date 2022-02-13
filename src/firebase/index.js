import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import FirebaseConfig from './firebase-config.json'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export const firebaseApp = firebase.initializeApp(FirebaseConfig.sdkConfig)
export const firestore = firebase.firestore(firebaseApp)
export const auth = firebase.auth()

const useEmulate = process.env.VUE_APP_EMULATE
if (useEmulate) {
  // Hack: cypress でテストするときの設定。useEmulator より前に設定が必要
  //       https://zenn.dev/cauchye/articles/20210816_yutaro-elk
  //       https://github.com/cypress-io/cypress/issues/2374#issuecomment-1012928429
  firestore.settings({ experimentalForceLongPolling: true })

  firestore.useEmulator('localhost', 3000)
  auth.useEmulator('http://localhost:9099')
}

export const firestoreUtil = {
  fromDate (date = new Date()) {
    return firebase.firestore.Timestamp.fromDate(date)
  },
  increment: firebase.firestore.FieldValue.increment
}

export const authUI = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
// FirebaseUIの設定値
export const uiConfig = {
  signInSuccessUrl: '/#/',
  signInOptions: [
    // 表示する認証バナーリスト
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  tosUrl: '' // 利用規約のURLを指定
}
