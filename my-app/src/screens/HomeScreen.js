import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import TransportOptions from '../components/TransportOptions';
import FavoriteRoutes from '../components/FavoriteRoutes';
import { globalStyles } from '../styles/index';

const HomeScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header />
      <ScrollView>
        <SearchBar />
        <TransportOptions />
        <FavoriteRoutes />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
