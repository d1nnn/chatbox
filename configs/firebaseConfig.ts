import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  getReactNativePersistence,
  initializeAuth,
  connectAuthEmulator,
} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore, collection, connectFirestoreEmulator, initializeFirestore } from '@firebase/firestore'
import { getStorage } from '@firebase/storage'




const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE
}

const app = initializeApp(firebaseConfig)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

export const storage = getStorage(app)


export default {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
}

// export const db = getFirestore(app)
// connectFirestoreEmulator(db, 'localhost', 8080);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalLongPollingOptions: { timeoutSeconds: 10 }
})
// connectAuthEmulator(auth, "http://10.0.2.2:9099")
// connectFirestoreEmulator(db, '10.0.2.2', 8080);

export const usersRef = collection(db, "users")


export const roomsRef = collection(db, "rooms")
