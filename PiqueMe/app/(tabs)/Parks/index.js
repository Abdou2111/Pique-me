import {View} from "react-native";
import {Text} from "react-native-paper";
import {Link} from "expo-router";

const Index = (() => {
    return (
        <View>
            <Text>Page des parks</Text>
            <Link href="/(tabs)/Parks/second" style={{color: 'blue', textDecorationLine: 'underline'}} push asChild>
                <Text>Go to Second Page</Text>
            </Link>

        </View>
    )
})

export default Index;