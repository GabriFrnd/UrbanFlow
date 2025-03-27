import React from 'react';
import { View, Text, Button } from 'react-native';

const ScreenOne = ({ navigation }) => {
  return (
    <View>
      <Text>Screen One</Text>
      <Button
        title="Go to Screen Two"
        onPress={() => navigation.navigate('ScreenTwo')}
      />
    </View>
  );
};

export default ScreenOne;