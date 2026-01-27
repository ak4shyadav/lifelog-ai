import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Dashboard, Sleep, Focus, Habits, Journal } from './src/screens';
import { colors } from './src/theme/colors';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Sleep" component={Sleep} />
          <Stack.Screen name="Focus" component={Focus} />
          <Stack.Screen name="Habits" component={Habits} />
          <Stack.Screen name="Journal" component={Journal} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
