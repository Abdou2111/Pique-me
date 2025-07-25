/* UserDocContext.tsx
   • Fournit uid, userDoc, et méthodes toggleFav / updateProfile
   • À wrapper autour de ton RootLayout.
*/

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import {
  ensureUserDoc,
  subscribeUserDoc,
  toggleFavorite,
  updateUserProfile
} from '../utils/firebaseUtils'

type Ctx = {
  uid: string | null
  userDoc: any
  toggleFav: (parkId: string, add: boolean) => Promise<void>
  updateProfile: (data: any) => Promise<void>
}
const UserDocContext = createContext<Ctx>({
  uid: null,
  userDoc: null,
  toggleFav: async () => {},
  updateProfile: async () => {}
})

export function UserDocProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null)
  const [userDoc, setUserDoc] = useState<any>(null)

  /* → écoute login/logout */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null)
        setUserDoc(null)
        return
      }
      setUid(user.uid)
      await ensureUserDoc(user.uid)                 // crée doc si besoin
      return subscribeUserDoc(user.uid, setUserDoc) // live updates
    })
    return unsub
  }, [])

  return (
    <UserDocContext.Provider
      value={{
        uid,
        userDoc,
        toggleFav: (pid, add) => (uid ? toggleFavorite(uid, pid, add) : Promise.resolve()),
        updateProfile: (d) => (uid ? updateUserProfile(uid, d) : Promise.resolve())
      }}
    >
      {children}
    </UserDocContext.Provider>
  )
}

export const useUserDoc = () => useContext(UserDocContext)