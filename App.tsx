import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import TodayScreen from './src/screens/TodayScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import StatsScreen from './src/screens/StatsScreen';
import {theme} from './src/theme';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.bg,
    card: theme.surface,
    border: theme.border,
    primary: theme.accent,
    text: theme.text,
    notification: theme.accent,
  },
};

function TabIcon({name, focused}: {name: string; focused: boolean}) {
  const icons: Record<string, string> = {
    Today: '○',
    Calendar: '□',
    Stats: '≡',
  };
  const color = focused ? theme.accent : theme.textMuted;
  return React.createElement(
    require('react-native').Text,
    {style: {fontSize: 20, lineHeight: 22, color}},
    icons[name] ?? '•',
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused}) => (
              <TabIcon name={route.name} focused={focused} />
            ),
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.textMuted,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
            headerShown: false,
          })}>
          <Tab.Screen name="Today" component={TodayScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Stats" component={StatsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
