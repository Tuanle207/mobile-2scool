import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { getRoleUser, login } from '../api/login'
import { color } from '../assets/color'
import { fontSize, height, width } from '../assets/size'
import { loginSuccess } from '../redux/action/auth'
import Octicons from 'react-native-vector-icons/Octicons'
import LoadingBase from '../component/LoadingBase'
import { checkRoleUser } from '../redux/action/roleUser'
const resetAction = CommonActions.reset({
  index: 0,
  routes: [{ name: 'AppStack' }],
});
const AuthScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('lalala123')
  const [pass, setPass] = useState('1q2w3E*')
  const [errorMessage, setErrorMessage] = useState('')
  const [seePass, setSeePass] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginApi = async () => {
    setIsLoading(true);
    try {
      const res: any = await login({ username: userName, password: pass })

      const payload = {
        access_token: res.data.access_token,
        token_type: res.data.token_type,
        refresh_token: res.data.refresh_token,
        expires_in: res.data.expires_in,
        scope: res.data.scope
      }

      await dispatch(loginSuccess(payload))
      const res1: any = await getRoleUser()
      if (res1?.status == 200) {
        var body = {
          CreateNewDcpReport: false,
          CreateNewLRReport: false,
        }
        const dataRoleAuth = res1?.data?.auth?.grantedPolicies;
        Object.keys(dataRoleAuth).forEach(value => {
          if (value == "LRReports.CreateNewLRReport")
            body.CreateNewLRReport = dataRoleAuth[value];
          else if (value == "DcpReports.CreateNewDcpReport")
            body.CreateNewDcpReport = dataRoleAuth[value]
        })
        await dispatch(checkRoleUser(body))
      } setIsLoading(false);
      navigation.dispatch(
        resetAction
      )

    } catch (err) {
      setIsLoading(false);
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
      <LoadingBase visible={isLoading} />
      <Image source={require('../assets/icon/SCOOL.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={userName}
          onChangeText={(value: string) => setUserName(value)}
        />
        <View style={styles.inputPass}>
          <TextInput
            secureTextEntry={seePass}
            placeholder="Mật khẩu"
            value={pass}
            onChangeText={(value: string) => setPass(value)}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setSeePass(!seePass)}>
            {/* <Image source={require('../assets/icon/eye.png')} style={styles.iconEye} /> */}
            <Octicons
              name={seePass ? 'eye' : "eye-closed"}
              color={"gray"}
              size={24}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.errMess}>{errorMessage}</Text>
        <TouchableOpacity
          onPress={() => loginApi()}
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
    backgroundColor: color.blue,
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
  inputPass: {
    backgroundColor: 'white',
    width: width.button,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  errMess: {
    fontSize: fontSize.tag,
    color: 'red'
  },
  iconEye: {
    width: 30,
    height: 30,
    tintColor: 'grey'
  }
})

export default AuthScreen