import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';

export default function Home() {
    return (
        <View style={S.page}>
            <Header />
            {/*  le reste du contenu  */}
        </View>
    );
}

const S = StyleSheet.create({
    page:{ flex:1 },
    h1:{ fontSize:24, fontWeight:'700', alignSelf:'center', marginTop:12 }
});
