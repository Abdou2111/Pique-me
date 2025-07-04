import * as React from 'react';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

type Props = {
    version: number;
}

const Commentaire :React.FC<Props> = ({version}) => {
    // text contient le text saisi, setText est la fonction qui permet de refresh le texte saisi
    const [text, setText] = React.useState('');
    const [imageUri, setImageUri] = React.useState<string | null>(null);

    const pickImage = async () =>{
        // Demande de permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert('Permission refusée', 'Vous devez autoriser l’accès à la galerie.');
            return;
        }

        // Ouvrir la galerie si tout est ok
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0){
            setImageUri(result.assets[0].uri);
            Alert.alert('Image sélectionnée !');
        }
    }

    if(version === 1){  // Champ de commentaire dans l'évaluation
        return (

            <TextInput
                placeholder={"Dis en plus sur ton expérience..."}
                label="Commentaire"
                mode="outlined" //label dans la bordure du champ avec un encadré
                value={text}
                onChangeText={text => setText(text)}
            />
        )
    }else{  // Champ de commentaire simple avec bouton d'envoi et image
        return (
            <TextInput
                placeholder={"Votre avis..."}
                label="Commentaire"
                mode="flat"
                value={text}
                onChangeText={text => setText(text)}
                right={[
                    <TextInput.Icon key="image" icon="file-image-plus-outline" onPress={pickImage}/>,
                    // deamder aux autres comment se fait la sauvegarde des commentaires
                    <TextInput.Icon key="send" icon="send" />
                ]}
            />
        );

    }
};

export default Commentaire;