import { useUserDoc } from '@/app/context/UserDocContext'

export default function useFavorites() {
    const { userDoc, toggleFav } = useUserDoc()
    const favIds: string[] = Array.isArray(userDoc?.favorites) ? (userDoc!.favorites as string[]) : []
    const isFavorite = (stableId: string) => favIds.includes(stableId)
    const setFavorite = (stableId: string, selected: boolean) => toggleFav(stableId, selected)
    const ready = !!userDoc
    return { favIds, isFavorite, setFavorite, ready }
}
