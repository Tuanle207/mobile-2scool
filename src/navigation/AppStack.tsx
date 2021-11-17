import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import ChangePassword from '../screen/ChangePassword';
import ClassReportList from '../screen/ClassReportList';
import HomeScreen from '../screen/HomeScreen';
import LrReport from '../screen/LrReport';
import MistakeCreate from '../screen/MistakeCreate';
import MistakeDetail from '../screen/MistakeDetail';
import ReportInfo from '../screen/ReportInfo';
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
      {_renderItemScreen('ReportInfo', ReportInfo)}
      {_renderItemScreen('ClassReportList', ClassReportList)}
      {_renderItemScreen('MistakeCreate', MistakeCreate)}
      {_renderItemScreen('MistakeDetail', MistakeDetail)}
      {_renderItemScreen('LrReport', LrReport)}
      {_renderItemScreen('ChangePassword', ChangePassword)}
    </Stack.Navigator>
  )
}

export default AppStack