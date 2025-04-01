import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/index';

const FavoriteRoutes = () => {
  return (
    <View style={globalStyles.favoritesContainer}>
      <Text style={globalStyles.routeTitle}>⭐ Rotas Favoritas</Text>

      <View style={globalStyles.routeCard}>
        <Text style={globalStyles.routeTitle}>Casa</Text>
        <Text>→ Trabalho</Text>
        <Text>⏳ 23 min</Text>
      </View>

      <View style={globalStyles.routeCard}>
        <Text style={globalStyles.routeTitle}>Academia</Text>
        <Text>→ Casa</Text>
        <Text>⏳ 08 min</Text>
      </View>
    </View>
  );
};

export default FavoriteRoutes;
