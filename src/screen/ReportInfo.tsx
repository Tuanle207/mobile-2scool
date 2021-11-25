import { CommonActions, useNavigation } from '@react-navigation/native'
import { isAnyOf } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
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

interface Props {

}

const ReportInfo = (props: Props) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const dcpReport = useSelector((state: RootState) => state.mistake)
  const listClassReport = dcpReport.dcpClassReports
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const listClassReportApi = listClassReport.filter(item => item.faults.length > 0)
  const [listClass, setListClass] = useState<Class[]>([])

  //check list empty
  const [isEmpty, setEmpty] = useState<boolean>(false);
  //Information list of votes
  const [listClassReportState, setListClassReportState] = useState(listClassReportApi)
  //list information in reducers
  const [dcpReport1, setdcpRport1] = useState(dcpReport)

  useEffect(() => {
    initClass()
  }, [])

  useEffect(() => {
    const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(listClassReport))
    var count = 0;
    newListClassReport.map((item: DcpClassesReport, index: number) => {
      if (newListClassReport[index].faults.length != 0) count++;
    })
    if (count === 0) {
      setEmpty(true)
    }
    setdcpRport1(dcpReport);
  }, [dcpReport?.dcpClassReports, dcpReport])

  const initClass = async () => {
    try {
      const res: any = await getClass();
      setListClass(res.data.items)
    } catch (err) {
      Alert.alert("Error")
      console.log(err)
    }
  }

  const deleteClass = (item: DcpClassesReport) => {

    const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(listClassReport))
    console.log(item, newListClassReport);
    newListClassReport.map((item1:any, index:number)=>{
      if(item?.classId ===item1?.classId){
        newListClassReport[index].faults = []
      }
    })
    dcpReport.dcpClassReports = newListClassReport
    dispatch(addClassMistake(dcpReport))
    const listClassReport1 = dcpReport1.dcpClassReports
    const listClassReportApi = listClassReport1.filter(item => item.faults.length > 0)
    setListClassReportState(listClassReportApi);
    // navigation.dispatch(
    //   CommonActions.navigate({
    //     name: 'HomeScreen',
    //   })
    // )
  }

  const _renderClass = (item: DcpClassesReport, index: number) => {
    const classInfo = listClass.find(classItem => classItem.id === item.classId)
    const className: any = classInfo?.name
    const faultsInfo = item.faults.map((item: Faults) => {
      const faultInfo = listRegulationApi.find(fault => fault.id === item.regulationId)
      return {
        regulationName: faultInfo?.name,
        point: faultInfo?.point,
        relatedStudentIds: item.relatedStudentIds
      }
    })
    const totalFault = faultsInfo.length
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
          <TouchableOpacity onPress={() => deleteClass(item)}>
            <Image source={require('../assets/icon/remove.png')} style={styles.iconRemove} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const createDcpReport = async () => {
    try {
      const res = await postDcpReport(dcpReport);
      if (res) {
        Alert.alert("Success", "Create DcpReport success", [
          {
            text: "OK", onPress: () => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'BottomTab',
                })
              )
              const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(listClassReport))

              newListClassReport.map((item: DcpClassesReport, index: number) => {
                newListClassReport[index].faults = [];
              })
              dcpReport.dcpClassReports = newListClassReport
              dispatch(addClassMistake(dcpReport))
            }
          },
        ],
          { cancelable: false })
      }
    }
    catch (err) {
      console.log('errs', err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thông tin phiếu chấm" />
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        <View>
          {listClassReportState.map((item, index) => _renderClass(item, index))}
        </View>
        <TouchableOpacity disabled={isEmpty}
          onPress={() => createDcpReport()}
          style={[mainStyle.buttonContainer, styles.buttonAdd, { backgroundColor: isEmpty ? 'gray' : color.blueStrong }]}>
          <Text style={mainStyle.buttonTitle}>Gửi phiếu chấm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ReportInfo

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
    width: widthDevice * 80 / 100,
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
    marginBottom: 20
  }
})