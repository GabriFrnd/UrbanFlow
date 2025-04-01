import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/index';

const Header = () => {
  return (
    <>
    <View style={globalStyles.header}>
      <Text style={globalStyles.headerText}>UrbanFlow</Text>
    </View>
    <View>
        <Text style={globalStyles.bodyText}>Descubra suas opções de mobilidade urbana</Text>
    </View>
    </>
  );
};

export default Header;
