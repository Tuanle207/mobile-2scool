import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { getRoleUser, login } from '../api/login'
import { color } from '../assets/color'
import { fontSize, height, width } from '../assets/size'
import { loginSuccess } from '../redux/action/auth'
import Octicons from 'react-native-vector-icons/Octicons'
import LoadingBase from '../component/LoadingBase'
import { checkRoleUser } from '../redux/action/roleUser'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { getTenantSimpleList } from '../api/tenant'
import AsyncStorage from '@react-native-async-storage/async-storage';

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{ name: 'AppStack' }],
});
const AuthScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [pass, setPass] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [seePass, setSeePass] = useState(true)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [ openTenantDropdown, setOpenTenantDropdown ] = useState(false);
  const [ selectedTenant, setSelectedTenant ] = useState<string | null>(null);
  const [ tenants, setTenants ] = useState<ItemType<string>[]>([]);

  useEffect(() => {
    const initTenants = async () => {
      const tenantsRes = await getTenantSimpleList();
      const tenants: ItemType<string>[] = tenantsRes.data.items.map(x => ({
        label: x.displayName,
        value: x.name,
      }));
      const selectedTenant = await AsyncStorage.getItem('tenant_name') || null;
      setSelectedTenant(selectedTenant);
      setTenants(tenants);
      console.log(selectedTenant);
    };
    initTenants();
  }, []);

  useEffect(() => {
    const setItem = async (selectedTenant: string | null) => {
      AsyncStorage.setItem('tenant_name', selectedTenant || '');
      const item = await AsyncStorage.getItem('tenant_name');
      console.log({item})
    };
    setItem(selectedTenant);
  }, [selectedTenant]);

  const loginApi = async () => {
    if (!selectedTenant) {
      setErrorMessage('Vui lòng chọn trường của bạn');
      return;
    }
    try {
      setIsLoading(true);
      const res: any = await login({ username: userName, password: pass, tenant: selectedTenant })

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
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={color.blue}
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        hidden={false} />
      <LoadingBase visible={isLoading} />
      <View
        style={{ 
          marginHorizontal: 10, 
        }}
      >
      {/* {
        !selectedTenant ? (
          <DropDownPicker
            placeholder="Chọn trường"
            ListEmptyComponent={() => <Text style={{ padding: 10 }}>Danh sách trống</Text>}
            open={openTenantDropdown}
            value={selectedTenant}
            items={tenants}
            setOpen={setOpenTenantDropdown}
            setValue={setSelectedTenant}
            setItems={setTenants}
          />
        ) : (
          <View style={{
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%'
          }}>
          <Text>{selectedTenant && tenants.find(x => x.value === selectedTenant)?.label}</Text>
          <TouchableOpacity
            onPress={() => setSelectedTenant(null)}
          >
            <AntDesignIcon
              name="edit"
              size={24}
              color="blue"
            />
          </TouchableOpacity>
          </View>
        )
      } */}
      </View>
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