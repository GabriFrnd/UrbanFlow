const AppNavigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ScreenOne">
          <Stack.Screen name="ScreenOne" component={ScreenOne} />
          <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
        </Stack.Navigator>
      </NavigationContainer>
    );
};
  
export default AppNavigator;