import 'react-native-gesture-handler';

import {StatusBar} from 'expo-status-bar';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';

import {Dimensions, StyleSheet, View} from 'react-native';
import {store} from './src/utils/store';
import MainNavigator from './src/navigation/mainNavigator';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNavigator />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
