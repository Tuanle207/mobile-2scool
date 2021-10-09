import { CommonActions, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { configEnv } from '../api/@config'
import { login } from '../api/login'
import { color } from '../assets/color'
import { fontSize, height, width } from '../assets/size'
import { loginSuccess, Token } from '../redux/action/auth'

const AuthScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('lalala123')
  const [pass, setPass] = useState('1q2w3E*')
  const [errorMessage, setErrorMessage] = useState('')

  const loginApi = async () => {

    try {
      const res: any = await login({ username: userName, password: pass })
      console.log('resr', res)
      const payload = {
        access_token: res.data.access_token,
        token_type: res.data.token_type,
        refresh_token: res.data.refresh_token,
        expires_in: res.data.expires_in,
        scope: res.data.scope
      }
      console.log('keytest', payload)
      dispatch(loginSuccess(payload))
      navigation.dispatch(
        CommonActions.navigate({
          name: 'AppStack',
        })
      )
    } catch (err) {
      console.log(err)
      setErrorMessage('Thông tin tài khoản không đúng')
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={color.blue}
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        hidden={false} />
      <Image source={require('../assets/icon/SCOOL.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={userName}
          onChangeText={(value: string) => setUserName(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={pass}
          onChangeText={(value: string) => setPass(value)}
        />
        <Text style={styles.errMess}>{errorMessage}</Text>
        <TouchableOpacity onPress={() => loginApi()}
          style={styles.button}
        >
          <Text style={styles.buttonTitle}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: color.blue
  },
  logo: {
    tintColor: 'black',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    backgroundColor: 'white',
    width: width.button,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 10
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    height: height.button,
    width: width.button,
    backgroundColor: color.blueStrong,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 20
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  errMess: {
    fontSize: fontSize.tag,
    color: 'red'
  }
})

export default AuthScreen