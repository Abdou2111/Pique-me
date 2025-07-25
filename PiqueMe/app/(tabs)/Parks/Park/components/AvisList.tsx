import React, { useRef, useState } from "react";
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";
import Avis from "./cardAvis";
import { AvisData } from "./cardAvis";

const { width: screenWidth } = Dimensions.get("window");

type Props = {
    avisList: AvisData[];
};

const AvisList: React.FC<Props> = ({ avisList }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(index);
    };

    const renderPaginationBars = () => {
        const total = avisList.length;
        const bars = total < 4 ? 4 : 4;
        const active = currentIndex % 4;

        return (
            <View style={styles.paginationContainer}>
                {Array.from({ length: bars }).map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.bar,
                            idx === active && styles.barActive,
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={avisList}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.idAvis.toString()}
                onMomentumScrollEnd={handleScroll}
                renderItem={({ item, index }) => (
                    <View style={{ width: screenWidth }}>
                        <Avis
                            {...item}
                            currentIndex={index}
                            totalCount={avisList.length}
                        />
                    </View>
                )}
            />
            {renderPaginationBars()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: screenWidth, // 🔧 Fixe la largeur du conteneur principal
        alignSelf: "center",
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    bar: {
        width: 40,
        height: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
        borderRadius: 2,
    },
    barActive: {
        height: 8,
        backgroundColor: "#333",
    },
});

export default AvisList;
