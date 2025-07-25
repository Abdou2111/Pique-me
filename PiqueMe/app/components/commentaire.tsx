import * as React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

type Props = {
    version: number;
};

const Commentaire: React.FC<Props> = ({ version }) => {
    const [text, setText] = React.useState('');
    const [imageUri, setImageUri] = React.useState<string | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Vous devez autoriser l’accès à la galerie.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
            Alert.alert('Image sélectionnée !');
        }
    };

    const handleSend = () => {
        Alert.alert('Commentaire envoyé');
    };

    const labelValue = version === 1 ? "Commentaire" : "";

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    placeholder={version === 1 ? "Dis en plus sur ton expérience..." : "Votre avis..."}
                    label={labelValue}
                    mode={version === 1 ? "outlined" : "flat"}
                    value={text}
                    onChangeText={setText}
                    style={styles.input}
                    multiline
                    right={
                        <TextInput.Icon
                            icon="file-image-plus-outline"
                            onPress={pickImage}
                        />
                    }
                />
                <IconButton
                    icon="send"
                    onPress={handleSend}
                    style={styles.sendButton}
                />
            </View>

            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 4,
        elevation: 2,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    sendButton: {
        marginLeft: 6,
    },
    imagePreview: {
        width: '100%',
        height: 150,
        marginTop: 10,
        borderRadius: 10,
    },
});

export default Commentaire;
