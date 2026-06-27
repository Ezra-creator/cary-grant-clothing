import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail
} from 'firebase/auth'

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string
) => {
  const result = await createUserWithEmailAndPassword(
    auth, email, password
  )
  await updateProfile(result.user, { displayName: name })
  return result.user
}

export const loginWithEmail = async (
  email: string, 
  password: string
) => {
  const result = await signInWithEmailAndPassword(
    auth, email, password
  )
  return result.user
}



export const logout = async () => {
  await signOut(auth)
}

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
