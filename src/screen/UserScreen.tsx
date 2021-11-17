import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native'
import { getUserInfo, logout } from '../api/user'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import HeaderHome from '../component/HeaderMain'
import { mainStyle } from './mainStyle'

const UserScreen = () => {
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = async () => {
    try {
      const res: any = await getUserInfo()
      setName(res.data.name)
      setPhone(res.data.phoneNumber)
      setEmail(res.data.email)
    } catch {
      Alert.alert('Error', 'Can not get user info')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome title="Thông tin tài khoản" />
      <View style={styles.mainContainer}>
        <View style={styles.user}>
          <Image source={require('../assets/icon/user-photo.png')} />
          <View style={styles.contentContainer}>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Tên</Text>
              <Text style={styles.content}>{name}</Text>
            </View>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Số điện thoại</Text>
              <Text style={styles.content}>{phone}</Text>
            </View>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Email</Text>
              <Text style={styles.content}>{email}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.dispatch(
        CommonActions.navigate({
          name: 'ChangePassword',
        })
      )}>
        <Text style={styles.password}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          logout()
          navigation.dispatch(
            CommonActions.navigate({
              name: 'AuthStack',
            })
          )
        }}
        style={[mainStyle.buttonContainer, styles.buttonSend]}>
        <Text style={mainStyle.buttonTitle}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: color.background
  },
  mainContainer: {
    flex: 1,
  },
  user: {
    flexDirection: 'row',
    width: widthDevice * 80 / 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 35

  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: fontSize.contentSmall
  },
  content: {
    fontSize: fontSize.contentSmall
  },
  buttonSend: {
    marginBottom: 20,
    marginHorizontal: 20,
    width: '80%'
  },
  password: {
    color: color.blueStrong,
    fontSize: fontSize.content,
    marginBottom: 20,
    textDecorationLine: 'underline'
  },
});

export default UserScreen