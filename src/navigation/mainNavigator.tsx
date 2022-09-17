import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import AuthNavigation from './authNavigation';
import {useSelector} from 'react-redux';
import {ProfileScreen} from '../screens/profile';
import HomeScreen from '../screens/home';
import MapScreen from '../screens/map';

const MainNav = createStackNavigator();

const MainNavigator = () => {
  const user = useSelector(state => state.auth.user);

  return (
    <MainNav.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          <MainNav.Screen name="Map" component={MapScreen} />
          <MainNav.Screen name="Home" component={HomeScreen} />
          <MainNav.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <MainNav.Screen name="AuthNav" component={AuthNavigation} />
      )}
    </MainNav.Navigator>
  );
};

export default MainNavigator;
