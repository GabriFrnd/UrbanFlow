import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { globalStyles } from '../styles/index';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const handleTextChange = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      navigation.navigate('Transport', { searchQuery: text });
    }
  };

  return (
    <View style={globalStyles.searchContainer}>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Para onde deseja ir?"
        placeholderTextColor="#666"
        value={searchText}
        onChangeText={handleTextChange}
        autoFocus={true}
      />
    </View>
  );
};

export default SearchBar;