import { auth } from '@/firebase'

export const signIn = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}
