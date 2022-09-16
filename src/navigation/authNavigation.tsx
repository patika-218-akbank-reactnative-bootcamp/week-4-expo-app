import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {SignUpScreen} from '../screens/sign-up';
import {SignInScreen} from '../screens/sign-in';

const AuthNav = createStackNavigator();

const AuthNavigation = () => {
  return (
    <AuthNav.Navigator>
      <AuthNav.Screen name="SignIn" component={SignInScreen} />
      <AuthNav.Screen name="SignUp" component={SignUpScreen} />
    </AuthNav.Navigator>
  );
};

export default AuthNavigation;
