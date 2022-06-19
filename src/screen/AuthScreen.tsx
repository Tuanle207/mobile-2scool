import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { getRoleUser, login } from '../api/login'
import { color } from '../assets/color'
import { fontSize, height, width, widthDevice } from '../assets/size'
import { loginSuccess } from '../redux/action/auth'
import Octicons from 'react-native-vector-icons/Octicons'
import LoadingBase from '../component/LoadingBase'
import { checkRoleUser } from '../redux/action/roleUser'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { getTenantSimpleList } from '../api/tenant'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import { TenantDto } from '../model/Tenant'

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
  const [ tenants, setTenants ] = useState<TenantDto[]>([]);
  const [ loadingTenant, setLoadingTenant ] = useState(true);

  useEffect(() => {
    const initTenants = async () => {
      setLoadingTenant(true);
      const tenantsRes = await getTenantSimpleList();
      const selectedTenant = await AsyncStorage.getItem('tenant_name') || null;
      setSelectedTenant(selectedTenant);
      setTenants(tenantsRes.data.items);
      setLoadingTenant(false);
    };
    initTenants();
  }, []);

  useEffect(() => {
    const setItem = async (selectedTenant: string | null) => {
      AsyncStorage.setItem('tenant_name', selectedTenant || '');
    };
    if (selectedTenant) {
      setItem(selectedTenant);
    }
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
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
      {
        !selectedTenant && !loadingTenant && (
          <MultiSelect
            fixedHeight
            single
            styleMainWrapper={styles.tenants}
            items={tenants}
            uniqueKey='name'
            onSelectedItemsChange={(items) => setSelectedTenant(items[0])}
            selectedItems={[selectedTenant]}
            noItemsText='Không có trường nào'
            selectText='Chọn trường THPT của bạn'
            searchInputPlaceholderText='Tìm kiếm trường THPT'
            styleTextDropdown={{ 
              fontSize: fontSize.tag,
              color: 'black',
              marginTop: 0
            }}
            styleTextDropdownSelected={{
              fontSize: fontSize.tag,
              color: 'black',
              marginTop: 0
            }}
            tagRemoveIconColor='gray'
            tagBorderColor='gray'
            tagTextColor='black'
            selectedItemTextColor='red'
            selectedItemIconColor='red'
            itemTextColor='#000'
            displayKey='displayName'
            submitButtonColor='#CCC'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />
        )
      }
      {
        selectedTenant && !loadingTenant && (
          <View style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            width: '100%'
          }}>
          <Text style={{
            fontSize: fontSize.content,
            fontWeight: '500',
            marginRight: 16
          }}>{selectedTenant && tenants.find(x => x.name === selectedTenant)?.displayName}</Text>
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
      }
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
  },
  tenants: {
    width: widthDevice * 92 / 100,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    // borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 5,
    zIndex: 100,
  },
})

export default AuthScreen