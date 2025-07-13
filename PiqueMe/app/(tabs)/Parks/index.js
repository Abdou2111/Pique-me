import {View} from "react-native";
import {Text} from "react-native-paper";
import {Link} from "expo-router";
import ParcFavoris from "../../components/parcFavoris";

const Index = (() => {
    return (
        <View>
            <Text>Page des parks</Text>
            <Link href="/(tabs)/Parks/second" style={{color: 'blue', textDecorationLine: 'underline'}} push asChild>
                <Text>Go to Second Page</Text>
            </Link>

            <Text style={{ fontSize: 20, padding: 16 }}>Page des parcs</Text>


            <ParcFavoris
                id="42"
                name="Parc Jarry"
                imageUri="https://picsum.photos/700"
                rating={4.6}
                reviews={178}
                distanceKm={3.4}
            />

        </View>
    )
})

export default Index;