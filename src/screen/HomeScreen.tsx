import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getClass } from '../api/class'
import { getCriteria, getRegulation } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import HeaderMain from '../component/HeaderMain'
import LoadingBase from '../component/LoadingBase'
import { Class } from '../model/Class'
import { addCriteria } from '../redux/action/criteria'
import { addClassMistake } from '../redux/action/mistake'
import { addRegulation } from '../redux/action/regulation'
import { RootState } from '../redux/reducer'
import { Faults } from '../redux/reducer/mistake'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const dcpReport = useSelector((state: RootState) => state.mistake)
  const roleUser = useSelector((state: RootState) => state.roleUser)
  const [search, setSearch] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [listClass, setListClass] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    initClass()
    initCriteria()
    initRegulation()
    setIsLoading(false);
  }, [])

  const initClass = async () => {
    try {
      const res: any = await getClass();
      setListClass(res.data.items)
      setClasses(res.data.items)
      addListClassMistake(res.data.items)
    } catch (err) {
      Alert.alert("Error")
    }
  }

  const initCriteria = async () => {
    try {
      const res: any = await getCriteria()
      // setListCriteria(res.data.items)
      dispatch(addCriteria(res.data.items))
    } catch (error) {
      Alert.alert('Error')
    }
  }

  const initRegulation = async () => {
    try {
      const res: any = await getRegulation()
      // setListCriteria(res.data.items)
      dispatch(addRegulation(res.data.items))
    } catch (error) {
      Alert.alert('Error')
    }
  }

  const addListClassMistake = (listClass: Class[]) => {
    if (dcpReport.dcpClassReports.length > 0) return
    const listClassMistake = listClass.map(item => {
      return {
        classId: item.id,
        faults: [] as Faults[]
      }
    })
    const dcpClassReports = {
      dcpClassReports: listClassMistake
    }
    dispatch(addClassMistake(dcpClassReports))
  }

  const _renderItem = (item: Class) => {
    return (      
       <TouchableOpacity onPress={() => navigation.dispatch(
            CommonActions.navigate({
              name: 'ClassReportList',
              params: item
            })
          )}>
          <View style={styles.classContainer}>
            <Text style={styles.class}>{item.name}</Text>
            <Image source={require('../assets/icon/edit.png')} />
          </View>
        </TouchableOpacity>
    )
  }

  const toChar = (str: string) => {
    return str.toLowerCase().
      normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const _setSearch = (value: string) => {
    setSearch(value)
    const newValue = value
    const newClasses = listClass.map(item => {
      return {
        name: toChar(item.name),
        id: item.id
      }
    })
    const newSearchClass = newClasses.filter(item => item.name.includes(newValue) === true)
    const newListClass: any[] = newSearchClass.map(item => {
      const newClass = listClass.find(itemChild => itemChild.id === item.id)
      return newClass
    })
    setClasses(newListClass)
  }

  if(!roleUser?.CreateNewDcpReport &&roleUser?.CreateNewLRReport)
{return(
  <SafeAreaView style={styles.container}>    
      <HeaderMain
        title="Trang chủ"
      />
      <Text style={{alignSelf:'center', marginTop:10, textAlignVertical:'center', fontStyle:'italic'}}>Bạn không có quyền truy cập</Text>
      </SafeAreaView>
)}
  return (
    <SafeAreaView style={styles.container}>
           <LoadingBase visible={isLoading} />
      <HeaderMain
        title="Trang chủ"
      />
      <View style={styles.mainContainer}>
        <Text style={styles.mainTitle}>Danh sách lớp chấm nề nếp</Text>
        <View style={styles.searchInput}>
          <Image source={require('../assets/icon/search.png')} style={styles.iconSearch} />
          <TextInput
            placeholder="Nhập tên lớp"
            placeholderTextColor={color.placeholder}
            value={search}
            onChangeText={(value: string) => _setSearch(value)}
          />
        </View>
        <View style={{ flex: 1}}>
          <FlatList
            data={classes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => _renderItem(item)}
          />
        </View>
      </View>
      <View style={styles.iconSendContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'ReportInfo',
          })
        )}>
          <Image source={require('../assets/icon/send.png')} style={styles.iconSend} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
    marginTop: 20,
  },
  iconSearch: {
    marginRight: 10
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: widthDevice * 90 / 100,
    height: 45,
    backgroundColor: 'white',
    color: 'black',
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 15,
    borderWidth: 0.2,
    borderColor: 'grey'
  },
  classContainer: {
    width: widthDevice * 90 / 100,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  class: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
  },
  iconSendContainer: {
    alignItems: 'flex-end'
  },
  iconSend: {
    width: 55,
    height: 55,
    margin: 20,
    marginBottom: 30
  }
});

export default HomeScreen