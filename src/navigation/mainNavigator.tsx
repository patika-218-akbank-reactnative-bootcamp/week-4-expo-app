import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import AuthNavigation from './authNavigation';

const MainNav = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainNav.Navigator screenOptions={{headerShown: false}}>
      <MainNav.Screen name="AuthNav" component={AuthNavigation} />
    </MainNav.Navigator>
  );
};

export default MainNavigator;
