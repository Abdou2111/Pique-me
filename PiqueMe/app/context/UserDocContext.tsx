import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import {
  ensureUserDoc,
  subscribeUserDoc,
  toggleFavorite,
  updateUserProfile,
} from '../utils/firebaseUtils'

export type UserDoc = {
    reservations: any[];
  favorites?: string[]
  preferences?: string[] | string
  firstName?: string
  lastName?: string
  createdAt?: Date
} | null

type Ctx = {
  uid: string | null
  userDoc: UserDoc
  toggleFav: (parkId: string, add: boolean) => Promise<void>
  updateProfile: (data: Partial<{ firstName: string; lastName: string; preferences: string[] | string }>) => Promise<void>
}

const UserDocContext = createContext<Ctx>({
  uid: null,
  userDoc: null,
  toggleFav: async () => {},
  updateProfile: async () => {},
})

export function UserDocProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null)
  const [userDoc, setUserDoc] = useState<UserDoc>(null)

  useEffect(() => {
    let unsubUser: (() => void) | null = null
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubUser) { unsubUser(); unsubUser = null }
      if (!user) { setUid(null); setUserDoc(null); return }
      setUid(user.uid)
      await ensureUserDoc(user.uid)
      unsubUser = subscribeUserDoc(user.uid, setUserDoc)
    })
    return () => { unsubAuth(); if (unsubUser) unsubUser() }
  }, [])

  return (
      <UserDocContext.Provider
          value={{
            uid,
            userDoc,
            toggleFav: (pid, add) => (uid ? toggleFavorite(uid, pid, add) : Promise.resolve()),
            updateProfile: (d) => (uid ? updateUserProfile(uid, d) : Promise.resolve()),
          }}
      >
        {children}
      </UserDocContext.Provider>
  )
}

export const useUserDoc = () => useContext(UserDocContext)
