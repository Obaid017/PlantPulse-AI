
import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
} from 'react-native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { supabaseConfigured } from '../services/supabaseClient';
import colors from '../constants/colors';

// Authentication screens
import SetupScreen from '../screens/SetupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Main farmer screens
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Result screens
import ResultScreen from '../screens/ResultScreen';
import SavedScanDetailScreen from '../screens/SavedScanDetailScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  const icons = {
    Home: 'home-outline',
    Scan: 'scan-outline',
    History: 'time-outline',
    Community: 'people-outline',
    Profile: 'person-outline',
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#84938A',

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarStyle: {
          height: 65,
          paddingTop: 7,
          paddingBottom: 7,
          backgroundColor: colors.white,
        },

        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={icons[route.name]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tabs.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Check Leaf',
        }}
      />

      <Tabs.Screen
        name="History"
        component={HistoryScreen}
      />

      <Tabs.Screen
        name="Community"
        component={CommunityScreen}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (!supabaseConfigured) {
    return <SetupScreen />;
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.green}
        />

        <Text
          style={{
            marginTop: 12,
            color: colors.muted,
          }}
        >
          Opening PlantPulse AI...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {session ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
          />

          {/* Result shown after checking a new leaf */}
          <Stack.Screen
            name="Result"
            component={ResultScreen}
          />

          {/* Complete report from scan history */}
          <Stack.Screen
            name="SavedScanDetail"
            component={SavedScanDetailScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
          />

          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
