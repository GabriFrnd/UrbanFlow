import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const TransportOptions = () => {
  const navigation = useNavigation(); 

  /**
   * Navega para a tela de transporte, passando um filtro inicial.
   * @param {string | null} filter - O tipo de transporte para filtrar ('metro', 'onibus', 'bike') ou null para mostrar todos.
   */
  const handlePress = (filter) => {
    navigation.navigate('Transport', { initialFilter: filter });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress(null)}>
        <Text style={styles.title}>Opções de Transporte</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handlePress('metro')}>
        <Image source={require('../assets/icons/metro.png')} style={styles.icon} />
        <Text style={styles.text}>Metrô</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handlePress('onibus')}>
        <Image source={require('../assets/icons/onibus.png')} style={styles.icon} />
        <Text style={styles.text}>Ônibus</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handlePress('bike')}>
        <Image source={require('../assets/icons/bicicleta.png')} style={styles.icon} />
        <Text style={styles.text}>Bicicleta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#C6AE7B',
    borderRadius: 10,
    borderColor: '#92703B',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5e3c',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default TransportOptions;