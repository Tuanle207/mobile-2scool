import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Image } from 'react-native'
import { colorBlueStrong } from '../assets/color'
import { iconSize } from '../assets/iconSize'
import HomeScreen from '../screen/HomeScreen'
import HistoryScreen from '../screen/HistoryScreen'
import AchieveScreen from '../screen/AchieveScreen'
import UserScreen from '../screen/UserScreen'

const BottomTab = () => {
  const BotTab = createBottomTabNavigator()

  return (
    <BotTab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: '#61a02c',
        headerShown: false
      }}
    >
      <BotTab.Screen name="HomeScreen" component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: iconSize, height: iconSize, tintColor: colorBlueStrong }}
              source={focused ? require('../assets/icon/home.png') : require('../assets/icon/home2.png')} />
          )
        }}
      />
      <BotTab.Screen name="HistoryScreen" component={HistoryScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: iconSize, height: iconSize, tintColor: colorBlueStrong }}
              source={focused ? require('../assets/icon/history.png') : require('../assets/icon/history2.png')} />
          )
        }} />
      <BotTab.Screen name="AchieveScreen" component={AchieveScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: iconSize, height: iconSize, tintColor: colorBlueStrong }}
              source={focused ? require('../assets/icon/book.png') : require('../assets/icon/book2.png')} />
          )
        }} />
      <BotTab.Screen name="UserScreen" component={UserScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: iconSize, height: iconSize, tintColor: colorBlueStrong }}
              source={focused ? require('../assets/icon/user.png') : require('../assets/icon/user2.png')} />
          )
        }} />
    </BotTab.Navigator>
  )
}

export default BottomTab