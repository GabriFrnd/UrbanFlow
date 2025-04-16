import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '../styles';

const Button = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[globalStyles.transportButton, style]}
      onPress={onPress}
    >
      <Text style={[globalStyles.transportButtonText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;