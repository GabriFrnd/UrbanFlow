import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { globalStyles } from '../styles';

import metroBg from '../assets/backgrounds/metro.png';
import onibusBg from '../assets/backgrounds/onibus.png';
import bikeBg from '../assets/backgrounds/bike.png';

const TransportScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
  const [selectedTransport, setSelectedTransport] = useState(route.params?.selectedTransport || 'metro');


  const transportOptions = [
    { id: 'metro', name: 'Metrô' },
    { id: 'onibus', name: 'Ônibus' },
    { id: 'bike', name: 'Bicicleta' }
  ];
  

  const getBackgroundImage = () => {
    switch (selectedTransport) {
      case 'metro':
        return metroBg;
      case 'bike':
        return bikeBg;
      case 'onibus':
        return onibusBg;
      default:
        return metroBg;
    }
  };

  useEffect(() => {
    if (route.params?.searchQuery) {
      setSearchQuery(route.params.searchQuery);
    }
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={getBackgroundImage()}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[globalStyles.containerTransparent, { paddingBottom: 150 }]}>
            <View style={globalStyles.headerContainerTransparent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={globalStyles.closeButton}
              >
                <Text style={globalStyles.closeText}>×</Text>
              </TouchableOpacity>
              <Text style={globalStyles.screenTitle}>Mapa</Text>
            </View>

            <View style={globalStyles.buttonBackgroundContainer}>
              <View style={globalStyles.transportButtonRow}>
                {transportOptions.map((transport) => (
                  <Button
                    key={transport.id}
                    title={transport.name}
                    onPress={() => setSelectedTransport(transport.id)}
                    style={globalStyles.transportButton}
                    textStyle={globalStyles.transportButtonText}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={globalStyles.bottomBar}>
            <SearchBar />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default TransportScreen;
