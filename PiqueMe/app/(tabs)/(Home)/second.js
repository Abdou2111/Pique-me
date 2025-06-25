import { StyleSheet, View, Text } from "react-native";

const Second = () => {
    return (
        <View style={styles.container}>
            <Text>Page Home 2</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: "red",
        alignItems: "center",
    },
});

export default Second;