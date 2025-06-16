import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { globalStyles } from '../styles';
import * as Location from 'expo-location';

import MapComponent from '../components/MapComponent';
import { busStops, metroStations, bikePoints } from '../data/mapPoints';

const fallbackCoords = [-15.8359, -47.9138];

// Funções para formatar os dados da rota
const formatDuration = (seconds) => {
  return `${Math.round(seconds / 60)} min`;
};

const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`.replace('.', ',');
};


const TransportScreen = ({ navigation }) => {
  const [selectedTransport, setSelectedTransport] = useState('metro');
  const [initialLocation, setInitialLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [previewedRouteInfo, setPreviewedRouteInfo] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const transportOptions = [
    { id: 'metro', name: 'Metrô' },
    { id: 'onibus', name: 'Ônibus' },
    { id: 'bike', name: 'Bicicleta' }
  ];

  const fetchRouteForPreview = async (destinationCoords, title) => {
    setIsLoadingPreview(true);
    setPreviewedRouteInfo(null);
    const profile = 'walking';
    const origin = initialLocation;
    if (!origin) {
      setIsLoadingPreview(false);
      return;
    }

    const accessToken = 'pk.eyJ1IjoiZGF2aWl6biIsImEiOiJjbWJ6YXdwbDEwMXQzMmlvaGtzaGt2cmFnIn0.ur9v4cPwhW530_wWnQ8dyw';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&overview=full&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        setPreviewedRouteInfo({
          geometry: routeData.geometry,
          duration: routeData.duration, // em segundos
          distance: routeData.distance, // em metros
          title: title
        });
      } else {
        Alert.alert("Erro", "Não foi possível encontrar uma rota para este destino.");
      }
    } catch (e) {
      console.error("Erro ao buscar a rota:", e);
      Alert.alert("Erro de Rede", "Não foi possível conectar à API de rotas.");
    } finally {
      setIsLoadingPreview(false);
    }
  };
  
  const onPointPress = async (event) => {
    if (isNavigating || isLoadingPreview || !event.features || event.features.length === 0) return;
    const feature = event.features[0];
    const destinationCoords = feature.geometry.coordinates;
    const title = feature.properties.title;

    await fetchRouteForPreview(destinationCoords, title);
  };

  const handleStartNavigation = () => {
    if (previewedRouteInfo) {
      setRoute(previewedRouteInfo.geometry);
      setIsNavigating(true);
      setPreviewedRouteInfo(null);
    }
  };
  
  const exitNavigation = () => {
    setRoute(null);
    setIsNavigating(false);
    setPreviewedRouteInfo(null);
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
          {!isNavigating && !previewedRouteInfo && (
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

          {isNavigating && (
            <View style={styles.navigationUiContainer} pointerEvents="box-none">
              <View style={styles.turnByTurnCard}>
                <Text style={styles.turnByTurnText}>Navegação Iniciada</Text>
                <Text style={styles.distanceText}>Siga a rota destacada no mapa.</Text>
              </View>
            </View>
          )}

          <View style={globalStyles.bottomBar} pointerEvents="box-none">
            {isNavigating ? (
              <TouchableOpacity style={styles.exitButton} onPress={exitNavigation} pointerEvents="auto">
                <Text style={styles.exitButtonText}>SAIR</Text>
              </TouchableOpacity>
            ) : isLoadingPreview ? (
              <ActivityIndicator size="large" color="#000" />
            ) : previewedRouteInfo ? (
              <View style={styles.previewContainer} pointerEvents="auto">
                <Text style={styles.previewTitle}>{previewedRouteInfo.title}</Text>
                <View style={styles.routeInfoContainer}>
                  <Text style={styles.routeInfoText}>{formatDuration(previewedRouteInfo.duration)}</Text>
                  <View style={styles.dotSeparator} />
                  <Text style={styles.routeInfoText}>{formatDistance(previewedRouteInfo.distance)}</Text>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation}>
                  <Text style={styles.startButtonText}>Iniciar Navegação</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setPreviewedRouteInfo(null)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
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
  
  previewContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingBottom: 10,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  routeInfoText: {
    fontSize: 16,
    color: '#333',
  },
  dotSeparator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#888',
    marginHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  
  navigationUiContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  turnByTurnCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  turnByTurnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  distanceText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  exitButton: { 
    backgroundColor: '#DE594E',
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: 'center',
    paddingHorizontal: 50,
  },
  exitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default TransportScreen;