import { initializeApp } from "firebase/app";
import FirebaseConfig from "../firebase-config.json";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  GithubAuthProvider,
  browserSessionPersistence,
  signInWithPopup,
} from "firebase/auth";

const firebaseApp = initializeApp(FirebaseConfig);

export const firestore = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
});
export const auth = getAuth(firebaseApp);
auth.setPersistence(browserSessionPersistence);
export const login = async () =>
  await signInWithPopup(auth, new GithubAuthProvider());
export const logout = async () => await auth.signOut();
