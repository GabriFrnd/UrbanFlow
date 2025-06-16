import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken("pk.eyJ1IjoiZGF2aWl6biIsImEiOiJjbWJ6YXdwbDEwMXQzMmlvaGtzaGt2cmFnIn0.ur9v4cPwhW530_wWnQ8dyw");

const App = () => {
  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
};

export default App;
