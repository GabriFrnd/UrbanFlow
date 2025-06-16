import React from 'react';
import { StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export const toGeoJSON = (points = []) => ({
  type: 'FeatureCollection',
  features: points.map(point => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: point.coords },
    properties: { id: point.id, title: point.title },
  })),
});

const MapComponent = ({
  userLocation,
  centerCoordinate,
  bounds, // Nova prop com os limites para o zoom
  busStops,
  metroStations,
  bikePoints,
  selectedTransport,
  selectedPointId,
  route,
  previewRoute,
  isNavigating,
  onPointPress,
}) => {
  
  const busStopsGeoJSON = toGeoJSON(busStops);
  const metroStationsGeoJSON = toGeoJSON(metroStations);
  const bikePointsGeoJSON = toGeoJSON(bikePoints);

  const highlightStyle = (defaultColor) => ({
    circleRadius: ['case', ['==', ['get', 'id'], selectedPointId || ''], 12, 8],
    circleColor: defaultColor,
    circleStrokeColor: '#000',
    circleStrokeWidth: ['case', ['==', ['get', 'id'], selectedPointId || ''], 3, 0],
  });

  // Função para decidir a configuração da câmera
  const getCameraConfig = () => {
    if (isNavigating) {
      return {
        followUserLocation: true,
        followUserMode: 'compass',
        followZoomLevel: 17,
        followPitch: 65,
        animationMode: 'flyTo',
        animationDuration: 1500,
      };
    }
    if (bounds) {
      return {
        fitBounds: [bounds.ne, bounds.sw], // Ajusta a câmera aos limites da rota
        padding: { paddingTop: 100, paddingBottom: 280, paddingLeft: 50, paddingRight: 50 }, // Margens
        animationMode: 'flyTo',
        animationDuration: 1200,
      };
    }
    return {
      zoomLevel: 15,
      centerCoordinate: centerCoordinate || userLocation,
      pitch: 0,
      animationMode: 'flyTo',
      animationDuration: 2000,
    };
  };

  return (
    <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Streets} scaleBarEnabled={false}>
      <Mapbox.Camera {...getCameraConfig()} />

      <Mapbox.UserLocation />

      {selectedTransport === 'onibus' && (
        <Mapbox.ShapeSource id="bus-source" shape={busStopsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
          <Mapbox.CircleLayer id="bus-circles" style={highlightStyle('blue')} />
        </Mapbox.ShapeSource>
      )}

      {selectedTransport === 'metro' && (
        <Mapbox.ShapeSource id="metro-source" shape={metroStationsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
          <Mapbox.CircleLayer id="metro-circles" style={highlightStyle('green')} />
        </Mapbox.ShapeSource>
      )}

      {selectedTransport === 'bike' && (
        <Mapbox.ShapeSource id="bike-source" shape={bikePointsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
          <Mapbox.CircleLayer id="bike-circles" style={highlightStyle('red')} />
        </Mapbox.ShapeSource>
      )}

      {previewRoute && !isNavigating && (
        <Mapbox.ShapeSource id="preview-route-source" shape={previewRoute}>
          <Mapbox.LineLayer
            id="preview-route-layer"
            style={{
              lineColor: '#5a9dfc',
              lineWidth: 5,
              lineOpacity: 0.8,
              lineDasharray: [2, 2.5],
            }}
          />
        </Mapbox.ShapeSource>
      )}
      
      {route && (
        <Mapbox.ShapeSource id="route-source" shape={route}>
          <Mapbox.LineLayer
            id="route-layer"
            style={{
              lineColor: '#007AFF',
              lineWidth: 5,
              lineOpacity: 0.84,
            }}
          />
        </Mapbox.ShapeSource>
      )}
    </Mapbox.MapView>
  );
};

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapComponent;