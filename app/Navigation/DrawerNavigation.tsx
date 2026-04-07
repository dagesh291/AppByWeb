import * as React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import Index from '../Index';
 
 
 

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
      <Drawer.Navigator initialRouteName="Home" screenOptions={{
        drawerActiveBackgroundColor:"#bde0fe",
         drawerStyle: {
      backgroundColor: "#ffff", 
    },
    headerStyle:{
          backgroundColor: "#ADB5D6",
    }
      }}>
        <Drawer.Screen name="Home" component={Index} />
       </Drawer.Navigator>
  );
}