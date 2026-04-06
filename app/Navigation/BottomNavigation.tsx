import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Index from '../tabs';
import { Button, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import LoaderButton from '@/Components/LoaderButton';
  
const Tab = createBottomTabNavigator();

function HomeScreen() {
 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    
      <Text>HomeScreen</Text>
    </View>
  );
}

function NotificationsScreen() {
 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Text>Notification</Text>
     </View>
  );
}

export default function BottomNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{
        tabBarLabel: 'Index',
          tabBarIcon: ({ color, size }) => (
            <Icon name="apple" color={color} size={size} />
          ),
      }} name="Index" component={Index} />
      <Tab.Screen options={{
         tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
      }} name="homescreen" component={HomeScreen} />
      <Tab.Screen options={{
         tabBarIcon: ({ color, size }) => (
            <Icon name="bug" color={color} size={size} />
          ),
      }} name="noti" component={NotificationsScreen} />
       </Tab.Navigator>
  );
}