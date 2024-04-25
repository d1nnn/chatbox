// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import AuthProvider from './context/AuthContext'
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';
import MessageProvider from './context/MessageContext';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <MessageProvider>
          <NavigationContainer theme={DarkTheme}>
            <MainNavigator />
          </NavigationContainer>
        </MessageProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
