import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import HomeScreen from '../screen/HomeScreen';
import BottomTab from './BottomTab';

const AppStack = () => {
  const Stack = createNativeStackNavigator();

  const _renderItemScreen = (name: string, component: any) => (
    <Stack.Screen
      name={name}
      key={name}
      component={component}
    />
  );

  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{ gestureEnabled: false, headerShown: false }}>
      {_renderItemScreen('BottomTab', BottomTab)}
      {_renderItemScreen('HomeScreen', HomeScreen)}
      {/* {_renderItemScreen('AppStack', AppStack)} */}
    </Stack.Navigator>
  )
}

export default AppStack