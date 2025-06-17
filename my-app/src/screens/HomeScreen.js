import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
  SafeAreaView
} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import TransportOptions from '../components/TransportOptions';
import FavoriteRoutes from '../components/FavoriteRoutes';
import { globalStyles } from '../styles/index';
import { useNavigation } from '@react-navigation/native';

import { busStops, metroStations, bikePoints } from '../data/mapPoints';

const allPoints = [
  ...busStops.map(p => ({ ...p, type: 'onibus' })),
  ...metroStations.map(p => ({ ...p, type: 'metro' })),
  ...bikePoints.map(p => ({ ...p, type: 'bike' })),
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const handleResultPress = (point) => {
    setSearchText('');
    Keyboard.dismiss();
    navigation.navigate('Transport', { initialPoint: point });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={globalStyles.container}>
        <Header />
        
        <View style={styles.searchAreaContainer}>
          <SearchBar
            query={searchText}
            onQueryChange={setSearchText}
            onSearchSubmit={() => {
              if (searchResults.length > 0) {
                handleResultPress(searchResults[0]);
              }
            }}
          />
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
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
        </View>
        
        <ScrollView>
          <TransportOptions />
          <FavoriteRoutes />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAE2D6',
  },
  searchAreaContainer: {
    zIndex: 10,
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 1, 
    marginTop: -8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxHeight: 250,
  },
  resultItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default HomeScreen;