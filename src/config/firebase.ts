// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth, Unsubscribe } from 'firebase/auth'
import {
  child,
  DataSnapshot,
  get,
  getDatabase,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  set,
  ThenableReference,
} from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const id = process.env.REACT_APP_FIREBASE_PROJECT_ID

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${id}.firebaseapp.com`,
  databaseURL: `https://${id}-default-rtdb.firebaseio.com`,
  projectId: id,
  storageBucket: `${id}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_GA_ID,
}

// Initialize Firebase
// const apps = getApps();
const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app)
export const db = getDatabase(app)
export const auth = getAuth(app)

export const dbPush = (refName: string, payload: any): ThenableReference => push(ref(db, refName), payload)

export const dbSet = (refName: string, id: string, payload: any): Promise<void> =>
  set(ref(db, refName + '/' + id), payload)

export const dbRemove = (refName: string): Promise<void> => remove(ref(db, refName))

export const dbOnValue = (refName: string, cb: (snapshot: DataSnapshot) => void, opts?: any): Unsubscribe =>
  onValue(ref(db, refName), cb, opts)

export const dbGetValue = async (refName: string): Promise<DataSnapshot> => {
  return get(child(ref(db), refName))
}

export const dbOnDisconnect = (refName: string) => {
  onDisconnect(ref(db, refName)).set(false)
}
