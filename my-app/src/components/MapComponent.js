import React from 'react';
import { StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

// Importa os ícones da pasta de assets
import metroIcon from '../assets/icons/metro.png';
import busIcon from '../assets/icons/onibus.png';
import bikeIcon from '../assets/icons/bicicleta.png';

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
  bounds,
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

  // Estilo para os ícones principais (tamanho padrão unificado)
  const iconStyle = (iconName, size = 0.5) => ({
    iconImage: iconName,
    iconSize: size,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  });

  // Estilo para a borda de seleção
  const borderStyle = {
    circleRadius: 13,
    circleColor: 'transparent',
    circleStrokeColor: 'black',
    circleStrokeWidth: [
        'case',
        ['==', ['get', 'id'], selectedPointId || ''],
        2.5,
        0,
    ],
  };

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
        fitBounds: [bounds.ne, bounds.sw],
        padding: { paddingTop: 100, paddingBottom: 280, paddingLeft: 50, paddingRight: 50 },
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

      <Mapbox.Images images={{ metro: metroIcon, onibus: busIcon, bike: bikeIcon }} />

      <Mapbox.UserLocation />
      
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

      {/* Camada de Metrô: Borda + Ícone */}
      {(selectedTransport === 'metro' || !selectedTransport) && (
        <Mapbox.ShapeSource id="metro-source" shape={metroStationsGeoJSON} onPress={onPointPress} hitbox={{ width: 25, height: 25 }}>
          <Mapbox.CircleLayer id="metro-border" style={borderStyle} />
          <Mapbox.SymbolLayer id="metro-symbols" style={iconStyle('metro')} />
        </Mapbox.ShapeSource>
      )}

      {/* Camada de Ônibus: Borda + Ícone */}
      {(selectedTransport === 'onibus' || !selectedTransport) && (
        <Mapbox.ShapeSource id="bus-source" shape={busStopsGeoJSON} onPress={onPointPress} hitbox={{ width: 25, height: 25 }}>
          <Mapbox.CircleLayer id="bus-border" style={borderStyle} />
          <Mapbox.SymbolLayer id="bus-symbols" style={iconStyle('onibus')} />
        </Mapbox.ShapeSource>
      )}
      
      {/* Camada de Bicicleta: Borda + Ícone */}
      {(selectedTransport === 'bike' || !selectedTransport) && (
        <Mapbox.ShapeSource id="bike-source" shape={bikePointsGeoJSON} onPress={onPointPress} hitbox={{ width: 25, height: 25 }}>
           <Mapbox.CircleLayer id="bike-border" style={borderStyle} />
          <Mapbox.SymbolLayer id="bike-symbols" style={iconStyle('bike')} />
        </Mapbox.ShapeSource>
      )}
    </Mapbox.MapView>
  );
};

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapComponent;