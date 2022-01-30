import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  GoogleAuthProvider,
} from 'firebase/auth'
import { DateTime } from 'luxon'
import React, { useState, useContext, createContext, useEffect } from 'react'

import { auth, dbOnDisconnect, dbSet } from 'config/firebase'
import { getFingerPrint } from 'services/fingerprint'

interface AuthContextProps {
  initialLoading: boolean
  currentUser: User | null
  signup: (email: string, password: string) => void
  login: (email: string, password: string) => void
  logout: () => void
  loginWithGoogle: () => void
  setSessionId: (id: string) => void
}
const initialContext = {
  initialLoading: false,
  currentUser: null,
  signup: () => {},
  login: () => {},
  logout: () => {},
  loginWithGoogle: () => {},
  setSessionId: () => {},
}
const AuthContext = createContext<AuthContextProps>(initialContext)

export const useAuth = () => {
  return useContext(AuthContext)
}

interface Props {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = () => {
    if (currentUser) {
      const { fingerprintId } = getFingerPrint()
      dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'updatedAt', DateTime.now().toISO())
      dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'connected', false)
    }

    return signOut(auth)
  }

  useEffect(() => {
    if (!currentUser || !sessionId) return

    dbOnDisconnect(`auth/${currentUser.uid}/${sessionId}/connected`)
    // eslint-disable-next-line
  }, [sessionId])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextProps = {
    initialLoading: loading,
    currentUser,
    setSessionId,
    signup,
    login,
    logout,
    loginWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
