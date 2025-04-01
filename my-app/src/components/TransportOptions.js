import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/index';

const TransportOptions = () => {
  return (
    <View style={globalStyles.transportContainer}>
      <Text style={globalStyles.transportTitle}>Opções de Transporte</Text>
      <Text>🚇 Metrô</Text>
      <Text>🚌 Ônibus</Text>
      <Text>🚴‍♂️ Bicicleta</Text>
    </View>
  );
};

export default TransportOptions;
