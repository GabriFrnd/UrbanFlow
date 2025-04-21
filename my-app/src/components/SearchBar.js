import React, { useState } from 'react';
import { View, TextInput, Image } from 'react-native';
import { globalStyles } from '../styles/index';
import { useNavigation } from '@react-navigation/native';
import locIcon from '../assets/icons/loc.png';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (searchText.trim().length > 0) {
      navigation.navigate('Transport', { searchQuery: searchText });
    }
  };

  return (
    <View style={globalStyles.searchContainer}>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Para onde deseja ir?"
        placeholderTextColor="#8c8c8c"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSubmit} 
        returnKeyType="search"
      />
      <Image source={locIcon} style={globalStyles.searchIcon} />
    </View>
  );
};

export default SearchBar;
