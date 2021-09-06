import { initializeApp } from "firebase/app";
import FirebaseConfig from "../firebase-config.json";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GithubAuthProvider,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseApp = initializeApp(FirebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
auth.setPersistence(browserSessionPersistence);
export const authProvider = new GithubAuthProvider();
