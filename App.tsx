import 'react-native-gesture-handler';

import {StatusBar} from 'expo-status-bar';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';

import {store} from './src/utils/store';
import MainNavigator from './src/navigation/mainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <MainNavigator />
          </NavigationContainer>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
