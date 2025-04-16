import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { globalStyles } from '../styles';


//import { useNavigation } from '@react-navigation/native';

const TransportScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
    const transportOptions = [
        { id: 1, name: 'Metrô' },
        { id: 2, name: 'Bicicleta' },
        { id: 3, name: 'Ônibus' }
    ];

    useEffect(() => {
        if (route.params?.searchQuery) {
            setSearchQuery(route.params.searchQuery);
        }
    }, [route.params]);

    //const navigation = useNavigation();
    return (
        <>
            <ScrollView contentContainerStyle={[globalStyles.container, { flexGrow: 1 }]}>
                <View style={globalStyles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={globalStyles.closeButton}
                    >
                        <Text style={globalStyles.closeText}>×</Text>
                    </TouchableOpacity>
                    <Text style={globalStyles.screenTitle}>Mapa</Text>
                </View>
                {/* Botões no topo */}
                <View style={globalStyles.buttonBackgroundContainer}>
                    <View style={globalStyles.transportButtonRow}>
                        {transportOptions.map((transport) => (
                            <Button
                                key={transport.id}
                                title={transport.name}
                                onPress={() => console.log(`Selected ${transport.name}`)}
                                style={globalStyles.transportButton}
                                textStyle={globalStyles.transportButtonText}
                            />
                        ))}
                    </View>
                </View>

                {/* SearchBar no final */}
                <View style={[globalStyles.searchContainer, globalStyles.searchTransportContainer]}>
                    <View style={[globalStyles.searchContainer, { marginTop: 'auto' }]}>
                        <TextInput
                            style={globalStyles.searchInput}
                            placeholder="Para onde deseja ir?"
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default TransportScreen;