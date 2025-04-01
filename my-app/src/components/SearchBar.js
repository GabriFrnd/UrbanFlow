import React from 'react';
import { View, TextInput } from 'react-native';
import { globalStyles } from '../styles/index';

const SearchBar = () => {
  return (
    <View style={globalStyles.searchContainer}>
      <TextInput style={globalStyles.searchInput} placeholder="Para onde deseja ir?" />
    </View>
  );
};

export default SearchBar;
