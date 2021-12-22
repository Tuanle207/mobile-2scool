import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { isAnyOf } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getClass } from '../api/class'
import { postDcpReport, putEditDcpReport } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { Class } from '../model/Class'
import { RootState } from '../redux/reducer'
import { mainStyle } from './mainStyle'
import { DcpClassesReport, Faults } from '../redux/reducer/mistakeHistory'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { addClassMistakeHistory } from '../redux/action/mistakeHistory'
import AntDesign from 'react-native-vector-icons/AntDesign'
const HistoryInfo = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route = useRoute();
  const dcpReportHistory = useSelector((state: RootState) => state.mistakeHistory)
  const data: any = route.params
  const listClassReport: any = data?.dcpClassReports
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const [listClass, setListClass] = useState<Class[]>([])
  //check list empty
  const [isEmpty, setEmpty] = useState<boolean>(false);
  //Information list of votes
  const [listClassReportState, setListClassReportState] = useState([])

  useEffect(() => {
    initClass()
  }, [])

  useEffect(() => {
    console.log("listClassReport", listClassReport)
    // const listClassReportApi = listClassReport.filter((item: any) => item.faults.length > 0)
    console.log("listClassReport", listClassReport)
    setListClassReportState(listClassReport)
  }, [dcpReportHistory?.dcpClassReports, dcpReportHistory])


  const initClass = async () => {
    try {
      const res: any = await getClass();
      console.log(res)
      setListClass(res.data.items)
      onHandleSaveRedux(res.data.items)
    } catch (err) {
      Alert.alert("Error")
      console.log(err)
    }
  }

  // const addListClassMistake = (listClass: Class[]) => {

  //   // if (dcpReportHistory.dcpClassReports.length > 0) return
  //   const listClassMistake = listClass.map(item => {
  //     return {
  //       classId: item.id,
  //       faults: [] as Faults[]
  //     }
  //   })
  //   const dcpClassReports = {
  //     dcpClassReports: listClassMistake
  //   }
  //   console.log("listClassReport", dcpClassReports)
  //   dispatch(addClassMistakeHistory(dcpClassReports))
  // }
  useEffect(() => {
    // useCallback(() => {
    console.log(dcpReportHistory)
  }, [dcpReportHistory])
  const onHandleSaveRedux = (listClass:Class[]) => {
    var listClassMistake = listClass.map(item => {
      return {
        classId: item.id,
        faults: [] as Faults[]
      }
    })

    listClassMistake.map((item: any, index: number) => {
      data?.dcpClassReports.map((item1: any) => {
        if (item1?.classId == item?.classId) {

          var dataFaults: Faults[] = [];
          item1?.faults.map((item3: any) => {
            console.log(item3)
            var arrayStudent: string[] = []
            item3?.relatedStudents.map((item4: any) => {
              arrayStudent.push(item4?.studentId)
            })
            const obj: any = {
              regulationId: item3?.regulationId,
              relatedStudentIds: arrayStudent,
            }
            dataFaults.push(obj)
          })
          listClassMistake[index].faults = dataFaults
        }
      })
    })
    console.log("listClassMistake", listClassMistake)
    const dcpClassReports = {
      dcpClassReports: listClassMistake
    }
    console.log("dcpClassReports", dcpClassReports)

    dispatch(addClassMistakeHistory(dcpClassReports))
  }

  const _renderClass = (item: DcpClassesReport, index: number) => {
    console.log("item1",item)
    const classInfo = listClass.find(classItem => classItem.id === item.classId)
    const className: any = classInfo?.name
    const faultsInfo = item.faults.map((item: any) => {
      console.log("item1",listRegulationApi, item.regulationId)
      const faultInfo = listRegulationApi.find(fault => fault.id === item.regulationId)
      return {
        regulationName: faultInfo?.name,
        point: faultInfo?.point,
        relatedStudentIds: item?.relatedStudentIds
      }
    })
    const totalFault = faultsInfo?.length
    console.log("totalFault",faultsInfo )
    const totalPoint = faultsInfo.reduce(((acc: number, cur: any) => acc + (cur?.relatedStudentIds?.length>0 ? cur?.point * cur?.relatedStudentIds?.length : cur?.point)), 0)
    return (
      <TouchableOpacity style={styles.itemContainer} key={index}
        onPress={() => {
          // onHandleSaveRedux();
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ClassReportListHistory',
              params: classInfo
            })
          )
        }}
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
          <TouchableOpacity onPress={() => { }}>
          <AntDesign
              name={'closecircleo'}
              color={"red"}
              size={24}
            /> 
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const EditDcReport = async () => {
    try {
      // const res = await postDcpReport(dcpReport);
      const listDcReport = dcpReportHistory.dcpClassReports.filter(item=>item?.faults.length !=0)
      const requestDcReport ={dcpClassReports:listDcReport}
            const res = await putEditDcpReport(requestDcReport, data?.id );
      if (res) {
        Alert.alert("Thành công", "Cập nhật phiếu chấm thành công", [
          {
            text: "OK", onPress: () => {
              navigation.goBack();
              const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(listClassReport))
              newListClassReport.map((item: DcpClassesReport, index: number) => {
                newListClassReport[index].faults = [];
              })
              dcpReportHistory.dcpClassReports = newListClassReport
              
              dispatch(addClassMistakeHistory(dcpReportHistory))
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
          {listClassReportState.map((item: any, index: number) => _renderClass(item, index))}
        </View>
        <TouchableOpacity disabled={isEmpty}
          onPress={() => { EditDcReport()}}
          style={[mainStyle.buttonContainer, styles.buttonAdd, { backgroundColor: isEmpty ? 'gray' : color.blueStrong }]}>
          <FontAwesome
            name={'send-o'}
            color={"white"}
            size={24}
          />
          <Text style={[mainStyle.buttonTitle, { fontSize: 18, marginHorizontal: 12 }]}>Cập nhật phiếu chấm</Text>
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
    width: widthDevice * 92 / 100,
    flexDirection: 'row'
  }
})