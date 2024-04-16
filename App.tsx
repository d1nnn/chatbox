// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AuthProvider from './context/AuthContext'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';
import MessageProvider from './context/MessageContext';

export default function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </MessageProvider>
    </AuthProvider>
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
