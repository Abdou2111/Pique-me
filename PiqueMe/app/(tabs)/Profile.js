import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function Profile() {
    return (
        <View style={S.page}>
            <Header />
            {/* contenu du profil */}
        </View>
    );
}

const S = StyleSheet.create({
    page:{ flex:1 },
    h1:{ fontSize:24, fontWeight:'700', alignSelf:'center', marginTop:12 }
});
