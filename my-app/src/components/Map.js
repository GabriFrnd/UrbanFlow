import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

// Importando os pontos do arquivo externo
import pointsData from '../resources/pointsData';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
    })();
  }, []);

  // Atualiza as coordenadas da rota quando o ponto é selecionado ou a localização muda
  useEffect(() => {
    if (selectedPoint && currentLocation) {
      setRouteCoordinates([currentLocation, selectedPoint.coordinate]);
    } else {
      setRouteCoordinates([]);
    }
  }, [selectedPoint, currentLocation]);

  const handlePointPress = (point) => {
    setSelectedPoint(point);
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!currentLocation && !error && <ActivityIndicator size="large" color="#0000ff" />}
      {currentLocation && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showsUserLocation={true}
          >
            {pointsData.map((point, idx) => (
              <Marker
                key={`${point.type}-${idx}`}
                coordinate={point.coordinate}
                title={point.title}
                description={point.description}
                icon={point.icon}
                onPress={() => handlePointPress(point)}
              />
            ))}

            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#FF6600"
                strokeWidth={4}
              />
            )}
          </MapView>

          {selectedPoint && (
            <View style={styles.selectedPointContainer}>
              <Text style={styles.selectedPointText}>
                Rota para: {selectedPoint.title}
              </Text>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => setSelectedPoint(null)}
              >
                <Text style={styles.clearButtonText}>Limpar rota</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  selectedPointContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPointText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6600',
    padding: 8,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Map;