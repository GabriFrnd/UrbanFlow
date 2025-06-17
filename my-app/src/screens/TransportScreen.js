import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Keyboard, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import { globalStyles } from '../styles';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import distance from '@turf/distance';
import { point } from '@turf/helpers';

import MapComponent from '../components/MapComponent';
import { busStops, metroStations, bikePoints } from '../data/mapPoints';

const fallbackCoords = [-47.9138, -15.8359];

const formatDuration = (seconds) => {
  return `${Math.round(seconds / 60)} min`;
};

const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`.replace('.', ',');
};

const allPoints = [
  ...busStops.map(p => ({ ...p, type: 'onibus' })),
  ...metroStations.map(p => ({ ...p, type: 'metro' })),
  ...bikePoints.map(p => ({ ...p, type: 'bike' })),
];

const TransportScreen = ({ navigation, route }) => {
  const initialFilter = route.params?.initialFilter;
  const initialPoint = route.params?.initialPoint;

  const [selectedTransport, setSelectedTransport] = useState(initialFilter);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [cameraBounds, setCameraBounds] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [previewRoute, setPreviewRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [previewedRouteInfo, setPreviewedRouteInfo] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const transportOptions = [
    { id: 'metro', name: 'Metrô' },
    { id: 'onibus', name: 'Ônibus' },
    { id: 'bike', name: 'Bicicleta' }
  ];

  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      return;
    }
    const lowerCaseQuery = searchText.toLowerCase().trim();
    const filteredResults = allPoints.filter(p =>
      p.title.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(filteredResults.slice(0, 5));
  }, [searchText]);


  const findAndPanToNearest = (transportType) => {
    if (!userLocation) return;
    const pointsToSearch = { metro: metroStations, onibus: busStops, bike: bikePoints }[transportType];
    if (!pointsToSearch || pointsToSearch.length === 0) return;
    const from = point(userLocation);
    let nearestPoint = null;
    let minDistance = Infinity;
    pointsToSearch.forEach(p => {
      const to = point(p.coords);
      const dist = distance(from, to, { units: 'kilometers' });
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = p;
      }
    });
    if (nearestPoint) {
      setMapCenter(nearestPoint.coords);
      setCameraBounds(null);
    }
  };
  
  const handleTransportSelection = (transportType) => {
    if (selectedTransport === transportType) {
      setSelectedTransport(null);
      setMapCenter(userLocation);
      setCameraBounds(null);
    } else {
      setSelectedTransport(transportType);
      findAndPanToNearest(transportType);
    }
    clearPreview();
  };

  const clearPreview = () => {
    setPreviewedRouteInfo(null);
    setPreviewRoute(null);
    setCameraBounds(null);
  };

  const fetchRouteForPreview = async (origin, destinationCoords, title, id, setBounds = true) => {
    Keyboard.dismiss();
    setIsLoadingPreview(true);
    clearPreview();
    const profile = 'walking';
    
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
          id: id, geometry: routeData.geometry,
          duration: routeData.duration, distance: routeData.distance, title: title
        });
        setPreviewRoute(routeData.geometry);
        if (setBounds) {
          const sw = [Math.min(origin[0], destinationCoords[0]), Math.min(origin[1], destinationCoords[1])];
          const ne = [Math.max(origin[0], destinationCoords[0]), Math.max(origin[1], destinationCoords[1])];
          setCameraBounds({ sw, ne });
        }
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

  const handleResultPress = (point) => {
    setSearchText(''); 
    setSelectedTransport(point.type);
    
    setMapCenter(point.coords);
    setCameraBounds(null);

    fetchRouteForPreview(userLocation, point.coords, point.title, point.id, false);
  };
  
  const onPointPress = async (event) => {
    if (isNavigating || isLoadingPreview || !event.features || event.features.length === 0) return;
    const feature = event.features[0];
    const destinationCoords = feature.geometry.coordinates;
    const { title, id } = feature.properties;
    await fetchRouteForPreview(userLocation, destinationCoords, title, id, true);
  };

  const handleStartNavigation = () => {
    if (previewedRouteInfo) {
      setActiveRoute(previewedRouteInfo.geometry);
      setIsNavigating(true);
      clearPreview();
    }
  };
  
  const exitNavigation = () => {
    setActiveRoute(null);
    setIsNavigating(false);
    clearPreview();
    setMapCenter(userLocation);
  };

  useEffect(() => {
    let locationWatcher;
    let isMounted = true;

    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if(isMounted) {
          setUserLocation(fallbackCoords);
          setMapCenter(fallbackCoords);
        }
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      const userCoords = [location.coords.longitude, location.coords.latitude];
      
      if (isMounted) {
        setUserLocation(userCoords);

        if (initialPoint) {
          setMapCenter(initialPoint.coords);
          setSelectedTransport(initialPoint.type);
          fetchRouteForPreview(userCoords, initialPoint.coords, initialPoint.title, initialPoint.id, false);
        } else {
          setMapCenter(userCoords);
          if (initialFilter) {
            findAndPanToNearest(initialFilter); 
          }
        }
      }

      locationWatcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (newLocation) => {
          if (newLocation.coords && isMounted) {
            const newUserCoords = [newLocation.coords.longitude, newLocation.coords.latitude];
            setUserLocation(newUserCoords);
          }
        }
      );
    };

    requestLocation();

    return () => {
      isMounted = false;
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

  const selectedPointId = previewedRouteInfo ? previewedRouteInfo.id : null;

  if (!userLocation) {
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
          userLocation={userLocation} centerCoordinate={mapCenter} bounds={cameraBounds}
          busStops={busStops} metroStations={metroStations} bikePoints={bikePoints}
          selectedTransport={selectedTransport} selectedPointId={selectedPointId}
          route={activeRoute}
          previewRoute={previewRoute}
          isNavigating={isNavigating} onPointPress={onPointPress}
        />

        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {!isNavigating && !previewedRouteInfo && (
            <View style={globalStyles.floatingMenuContainer} pointerEvents="auto">
              <View style={globalStyles.headerContainerTransparent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.closeButton}>
                  <Text style={globalStyles.closeText}>×</Text>
                </TouchableOpacity>
                <Text style={globalStyles.screenTitle}>Mapa</Text>
              </View>
              <View style={globalStyles.transportButtonRow}>
                {transportOptions.map((transport) => {
                  const isSelected = selectedTransport === transport.id;
                  return (
                    <TouchableOpacity
                      key={transport.id}
                      onPress={() => handleTransportSelection(transport.id)}
                      style={[
                        globalStyles.transportButton,
                        isSelected ? globalStyles.transportButtonActive : globalStyles.transportButtonInactive
                      ]}
                    >
                      <Text style={[
                        globalStyles.transportButtonText,
                        isSelected ? globalStyles.transportButtonTextActive : globalStyles.transportButtonTextInactive
                      ]}>
                        {transport.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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

          {!isNavigating && (
            <TouchableOpacity 
              style={styles.recenterButton} 
              onPress={() => {
                setMapCenter(userLocation);
                setCameraBounds(null);
              }} 
              pointerEvents="auto"
            >
              <MaterialIcons name="my-location" size={24} color="#333" />
            </TouchableOpacity>
          )}

          {searchResults.length > 0 && !previewedRouteInfo && (
            <View style={styles.searchResultsContainer} pointerEvents="auto">
                <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                />
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
                  {selectedTransport === 'bike' && <Text style={styles.routeInfoLabel}>Caminhada até a estação: </Text>}
                  <Text style={styles.routeInfoText}>{formatDuration(previewedRouteInfo.duration)}</Text>
                  <View style={styles.dotSeparator} />
                  <Text style={styles.routeInfoText}>{formatDistance(previewedRouteInfo.distance)}</Text>
                </View>
                <Text style={styles.previewSubtitle}>Deseja iniciar o percurso?</Text>
                <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation}>
                  <Text style={styles.startButtonText}>Iniciar Percurso</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    clearPreview();
                    setMapCenter(userLocation);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View pointerEvents="auto">
                <SearchBar
                  query={searchText}
                  onQueryChange={setSearchText}
                  onSearchSubmit={() => { if (searchResults.length > 0) handleResultPress(searchResults[0]) }}
                />
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAE2D6' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#000' },
  recenterButton: {
    position: 'absolute',
    bottom: 170, 
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
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
  previewSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeInfoLabel: {
    fontSize: 16,
    color: '#555',
  },
  routeInfoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dotSeparator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#888',
    marginHorizontal: 8,
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
  },
  
  searchResultsContainer: {
    position: 'absolute',
    bottom: 95,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 220,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  resultItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default TransportScreen;