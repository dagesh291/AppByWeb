import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Index from '../Index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import LoaderButton from '@/Components/LoaderButton';
import { View, StyleSheet, TextInput, Button, Alert,Text,ActivityIndicator  } from "react-native";
import Home from '../tabs/Home';

const Tab = createBottomTabNavigator();
export default function BottomNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{
        tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),headerStyle:{
          backgroundColor: "#ADB5D6",
      },
      headerTitleAlign: "center",

      }} name="Home" component={Home} />
       
       </Tab.Navigator>
  );
} 