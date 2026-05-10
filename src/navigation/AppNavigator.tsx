import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { LayoutDashboard, Scan, BarChart3, User } from 'lucide-react-native';
import { COLORS } from '../theme';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AnalyzeScreen from '../screens/Analyze/AnalyzeScreen';
import ProgressScreen from '../screens/Progress/ProgressScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.border,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Analyze"
          component={AnalyzeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Scan color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
