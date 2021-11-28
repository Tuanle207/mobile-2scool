import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { isAnyOf } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert  } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getClass } from '../api/class'
import { postDcpReport } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { Class } from '../model/Class'
import { addClassMistake } from '../redux/action/mistake'
import { RootState } from '../redux/reducer'
import { DcpClassesReport, Faults } from '../redux/reducer/mistake'
import { mainStyle } from './mainStyle'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const HistoryInfo = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route = useRoute();
  const data: any = route.params
  const listClassReport:any = data?.dcpClassReports
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const [listClass, setListClass] = useState<Class[]>([])
  //check list empty
  const [isEmpty, setEmpty] = useState<boolean>(false);
  //Information list of votes
  const [listClassReportState, setListClassReportState] = useState([])

  useEffect(() => {
    initClass()
  }, [])

  useEffect(()=>{
    const listClassReportApi = listClassReport.filter((item:any) => item.faults.length > 0)
    setListClassReportState(listClassReportApi)
  },[])


  const initClass = async () => {
    try {
      const res: any = await getClass();
      setListClass(res.data.items)
    } catch (err) {
      Alert.alert("Error")
      console.log(err)
    }
  }
  const _renderClass = (item: DcpClassesReport, index: number) => {
    const classInfo = listClass.find(classItem => classItem.id === item.classId)
    const className: any = classInfo?.name
    const faultsInfo = item.faults.map((item: any) => {
      const faultInfo = listRegulationApi.find(fault => fault.id === item.regulationId)
      return {
        regulationName: faultInfo?.name,
        point: faultInfo?.point,
        relatedStudentIds: item?.relatedStudents
      }
    })
    const totalFault = faultsInfo?.length
    const totalPoint = faultsInfo.reduce(((acc:number, cur:any) => acc + (cur.relatedStudentIds.length?cur?.point * cur.relatedStudentIds.length:cur?.point)), 0)
    return (
      <TouchableOpacity style={styles.itemContainer} key={index}
        onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'ClassReportList',
            params: classInfo
          })
        )}
      >
        <View style={styles.itemClassContainer}>
          <Text style={styles.itemClassName}>{className ? className : "Lớp"}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>
            Tổng điểm trừ:
            <Text style={styles.content}>{`  ${totalPoint}`}</Text>
          </Text>
          <Text style={styles.contentTitle}>
            Số lỗi vi phạm:
            <Text style={styles.content}>{`  ${totalFault}`}</Text>
          </Text>
        </View>
        <View style={styles.iconRemoveContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/icon/remove.png')} style={styles.iconRemove} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thông tin phiếu chấm" />
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        <View>
          {listClassReportState.map((item:any, index:number) => _renderClass(item, index))}
        </View>
        <TouchableOpacity disabled={isEmpty}
          onPress={() =>{}}
          style={[mainStyle.buttonContainer, styles.buttonAdd, { backgroundColor: isEmpty ? 'gray' : color.blueStrong }]}>
                    <FontAwesome
          name={'send-o'}
          color={"white"}
          size={24}
        />
          <Text style={[mainStyle.buttonTitle,{ fontSize: 18, marginHorizontal: 12 }]}>Cập nhật phiếu chấm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HistoryInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: 'center'
  },
  itemContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 15,
    width: widthDevice * 92 / 100,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: color.border
  },
  itemClassContainer: {
    width: widthDevice * 25 / 100,
    height: 70,
    backgroundColor: color.blue,
    borderRadius: 6,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemClassName: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
    color: 'white'
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-evenly'
  },
  contentTitle: {
    fontSize: fontSize.contentSmall
  },
  content: {
    color: 'red',
    fontWeight: 'bold'
  },
  iconRemove: {
    tintColor: 'gray',
    width: 26,
    height: 26,
  },
  iconRemoveContainer: {
    justifyContent: 'center',
    marginRight: 15
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    marginBottom: 20,
     width:  widthDevice * 92 / 100,
     flexDirection:'row'
  }
})