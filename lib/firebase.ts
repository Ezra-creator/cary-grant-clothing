import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { validateEnvVars } from './env-validation'

// Validate environment variables
const { valid } = validateEnvVars()
if (!valid && process.env.NODE_ENV === 'production') {
  throw new Error('Missing or invalid environment variables. Check your configuration.')
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp()
  }
  return initializeApp(firebaseConfig)
}

const app = getFirebaseApp()

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
export default app
