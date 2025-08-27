import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-paper';

// Import Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TripsScreen from '../screens/TripsScreen';
import RatingScreen from '../screens/RatingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TripInformationScreen from '../screens/TripInformationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Trips') {
            iconName = 'truck';
          } else if(route.name === 'Ratings'){
            iconName = 'star-circle';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return (
            <Icon 
              source={iconName} 
              color={color} 
              size={size} 
            />
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide headers for tab screens
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen} 
      />
      <Tab.Screen
        name ="Ratings"
        component={RatingScreen}
        />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
const AppNavigator = () => {
  const isAuthenticated = useSelector(state => state.trip.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers by default
        }}
      >
        {!isAuthenticated ? (
          // Auth screens - all headers hidden
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
            />
          </>
        ) : (
          // App screens - most headers hidden, show only for specific screens
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardTabs} 
            />
            <Stack.Screen 
              name="TripInformation" 
              component={TripInformationScreen} 
              options={{ 
                headerShown: false,
                title: 'Trip Details',
                headerStyle: {
                  backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;