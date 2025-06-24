import {View} from "react-native";
import {Text} from "react-native-paper";
import {Link} from "expo-router";

const Home = (() => {
    return (
        <View>
            <Text>Page home</Text>
            <Link href="/(tabs)/(Home)/second" style={{color: 'blue', textDecorationLine: 'underline'}} push asChild>
                <Text>Go to Second Page</Text>
            </Link>
        </View>
    )
})

export default Home;