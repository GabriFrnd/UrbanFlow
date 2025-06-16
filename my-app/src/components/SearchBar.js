import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { globalStyles } from '../styles/index';
import locIcon from '../assets/icons/loc.png';

const SearchBar = ({ query, onQueryChange, onSearchSubmit }) => {
  return (
    <View style={globalStyles.searchContainer}>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Pesquisar estação ou parada..."
        placeholderTextColor="#8c8c8c"
        value={query}
        onChangeText={onQueryChange}
        onSubmitEditing={onSearchSubmit} 
        returnKeyType="search"
      />
      <Image source={locIcon} style={globalStyles.searchIcon} />
    </View>
  );
};

export default SearchBar;