import React from 'react'
import { IconButton } from 'react-native-paper'

export default function HeartButton({
                                        isFavorite, onToggle, size = 24
                                    }: { isFavorite: boolean; onToggle: () => void; size?: number }) {
    return (
        <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            iconColor={isFavorite ? 'red' : 'white'}
            size={size}
            style={{ position:'absolute', top:8, right:8, backgroundColor:'rgba(0,0,0,0.4)', borderRadius:20 }}
            onPress={onToggle}
        />
    )
}
