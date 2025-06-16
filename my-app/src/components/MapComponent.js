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
  busStops,
  metroStations,
  bikePoints,
  route,
  isNavigating,
  onPointPress,
}) => {
  
  const busStopsGeoJSON = toGeoJSON(busStops);
  const metroStationsGeoJSON = toGeoJSON(metroStations);
  const bikePointsGeoJSON = toGeoJSON(bikePoints);

  return (
    <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Streets} scaleBarEnabled={false}>
      <Mapbox.Camera
        {...(isNavigating
          ? {
              followUserLocation: true,
              followHeading: 1,
              followZoomLevel: 16,
              followPitch: 60,
              animationMode: 'flyTo',
              animationDuration: 1500,
            }
          : {
              zoomLevel: 14,
              centerCoordinate: userLocation,
              pitch: 0, // Garante a visão de cima
              animationMode: 'flyTo',
              animationDuration: 2000,
            }
        )}
      />

      <Mapbox.UserLocation />
      <Mapbox.ShapeSource id="bus-source" shape={busStopsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
        <Mapbox.CircleLayer id="bus-circles" style={{ circleRadius: 8, circleColor: 'blue' }} />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="metro-source" shape={metroStationsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
        <Mapbox.CircleLayer id="metro-circles" style={{ circleRadius: 8, circleColor: 'green' }} />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="bike-source" shape={bikePointsGeoJSON} onPress={onPointPress} hitbox={{ width: 20, height: 20 }}>
        <Mapbox.CircleLayer id="bike-circles" style={{ circleRadius: 8, circleColor: 'red' }} />
      </Mapbox.ShapeSource>

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