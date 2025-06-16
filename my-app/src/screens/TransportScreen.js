import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { globalStyles } from '../styles';
import * as Location from 'expo-location';

import MapComponent from '../components/MapComponent';
import { busStops, metroStations, bikePoints } from '../data/mapPoints';

const fallbackCoords = [-15.8359, -47.9138];

const TransportScreen = ({ navigation }) => {
  const [selectedTransport, setSelectedTransport] = useState('metro');
  const [initialLocation, setInitialLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const transportOptions = [
    { id: 'metro', name: 'Metrô' },
    { id: 'onibus', name: 'Ônibus' },
    { id: 'bike', name: 'Bicicleta' }
  ];

  const fetchRoute = async (destination) => {
    const profile = 'walking';
    const origin = initialLocation;
    if (!origin) return;

    const accessToken = 'pk.eyJ1IjoiZGF2aWl6biIsImEiOiJjbWJ6YXdwbDEwMXQzMmlvaGtzaGt2cmFnIn0.ur9v4cPwhW530_wWnQ8dyw'; 
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry);
        setIsNavigating(true);
      } else {
        Alert.alert("Erro", "Não foi possível encontrar uma rota para este destino.");
      }
    } catch (e) {
      console.error("Erro ao buscar a rota:", e);
      Alert.alert("Erro de Rede", "Não foi possível conectar à API de rotas.");
    }
  };

  const onPointPress = (event) => {
    if (!event.features || event.features.length === 0) return;
    const feature = event.features[0];
    const { title } = feature.properties;
    const destination = feature.geometry.coordinates;

    Alert.alert(
      "Iniciar Percurso", `Deseja traçar uma rota até "${title}"?`,
      [{ text: "Cancelar", style: "cancel" }, { text: "Sim, Iniciar", onPress: () => fetchRoute(destination) }]
    );
  };
  
  const exitNavigation = () => {
    setRoute(null);
    setIsNavigating(false);
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setInitialLocation(fallbackCoords);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setInitialLocation([location.coords.longitude, location.coords.latitude]);
    };
    requestLocation();
  }, []);

  if (!initialLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#92703B" />
        <Text style={styles.loadingText}>Obtendo sua localização...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapComponent
          userLocation={initialLocation}
          busStops={busStops}
          metroStations={metroStations}
          bikePoints={bikePoints}
          selectedTransport={selectedTransport}
          route={route}
          isNavigating={isNavigating}
          onPointPress={onPointPress}
        />

        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {!isNavigating && (
            <View style={styles.uiContainer}>
              <View style={globalStyles.headerContainerTransparent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.closeButton} pointerEvents="auto">
                  <Text style={globalStyles.closeText}>×</Text>
                </TouchableOpacity>
                <Text style={globalStyles.screenTitle}>Mapa</Text>
              </View>
              <View style={globalStyles.buttonBackgroundContainer} pointerEvents="auto">
                <View style={globalStyles.transportButtonRow}>
                  {transportOptions.map((transport) => (
                    <Button key={transport.id} title={transport.name} onPress={() => setSelectedTransport(transport.id)} style={globalStyles.transportButton} textStyle={globalStyles.transportButtonText} />
                  ))}
                </View>
              </View>
            </View>
          )}

          <View style={globalStyles.bottomBar}>
            {isNavigating ? (
              <TouchableOpacity style={styles.exitButton} onPress={exitNavigation} pointerEvents="auto">
                <Text style={styles.exitButtonText}>SAIR DA NAVEGAÇÃO</Text>
              </TouchableOpacity>
            ) : (
              <View pointerEvents="auto">
                <SearchBar />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EAE2D6' },
  container: { flex: 1 },
  uiContainer: { paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAE2D6' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#000' },
  exitButton: { backgroundColor: '#e74c3c', paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  exitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default TransportScreen;