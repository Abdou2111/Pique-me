import { StyleSheet, View, Text } from "react-native";

const Second = () => {
    return (
        <View style={styles.container}>
            <Text>Page des parks 2</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: "yellow",
        alignItems: "center",
    },
});

export default Second;