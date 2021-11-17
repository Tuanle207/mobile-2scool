import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { changePassword } from '../api/user'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import Header from '../component/Header'
import { mainStyle } from './mainStyle'

const ChangePassword = () => {
  const navigation = useNavigation()
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassConfirm, setNewPassConfirm] = useState('')

  const sendRequest = async () => {
    if (newPass !== newPassConfirm) return Alert.alert("Warning", "Password confirm is incorrect")
    try {
      await changePassword(current, newPass)
      Alert.alert("Success", "Change password Success")
      navigation.dispatch(
        CommonActions.navigate({
          name: 'UserScreen',
        })
      )
    } catch (error) {
      if (error.response.status === 400) Alert.alert("Error", "Current password is incorrect")
      else Alert.alert("Error", "Change password fail")
    }
  }

  const _renderCurPassword = () => {
    return (
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Mật khẩu cũ</Text>
        <TextInput
          value={current}
          onChangeText={(text: string) => setCurrent(text)}
          placeholder="Nhập mật khẩu hiện tại"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>
    )
  }

  const _renderNewPassword = () => {
    return (
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Mật khẩu mới</Text>
        <TextInput
          value={newPass}
          onChangeText={(text: string) => setNewPass(text)}
          placeholder="Nhập mật khẩu mới"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>
    )
  }

  const _renderNewPasswordConfirm = () => {
    return (
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Xác nhận mật khẩu mới</Text>
        <TextInput
          value={newPassConfirm}
          onChangeText={(text: string) => setNewPassConfirm(text)}
          placeholder="Xác nhận mật khẩu mới"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đổi mật khẩu" />
      <View style={styles.mainContainer}>
        {_renderCurPassword()}
        {_renderNewPassword()}
        {_renderNewPasswordConfirm()}
      </View>
      <TouchableOpacity
        onPress={() => sendRequest()}
        style={[mainStyle.buttonContainer, styles.buttonSend]}>
        <Text style={mainStyle.buttonTitle}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  buttonAdd: {
    height: 35,
    width: '45%'
  },
  title: {
    fontSize: fontSize.contentSmall,
    marginBottom: 10
  },
  iamgeContainer: {
    marginTop: 40
  },
  pointContainer: {
    marginTop: 25
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.border
  },
  buttonSend: {
    marginBottom: 20,
    marginHorizontal: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: color.border,
    marginBottom: 15,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  iconPlus: {
    color: color.border,
    fontSize: 50,
    flex: 3,
  },
  titleButtonImage: {
    color: color.border,
    fontWeight: 'bold',
    fontSize: fontSize.title,
    flex: 2
  }
})

export default ChangePassword