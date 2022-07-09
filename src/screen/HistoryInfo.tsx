import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { isAnyOf } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getClass } from '../api/class'
import { getMyDcpReportId, postDcpReport, putEditDcpReport } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { Class } from '../model/Class'
import { RootState } from '../redux/reducer'
import { mainStyle } from './mainStyle'
import { DcpClassesReport, Faults } from '../redux/reducer/mistakeHistory'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { addClassMistakeHistory } from '../redux/action/mistakeHistory'
import LoadingBase from '../component/LoadingBase'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { showPoint } from '../ultil/ShowPoint';

const HistoryInfo = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route = useRoute();
  const dcpReportHistory = useSelector((state: RootState) => state.mistakeHistory)
  const data: any = route.params
  console.log("data", data)
  const [listClassReport, setListClassReport] = useState<any>();
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const [listClass, setListClass] = useState<Class[]>([])
  //check list empty
  const [isEmpty, setEmpty] = useState<boolean>(false);
  //Information list of votes
  const [listClassReportState, setListClassReportState] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirst, setIsFirst] = useState<number>(1);

  useEffect(() => {
    getDetailHistoryInfo()
  }, [])

  const getDetailHistoryInfo = async () => {
    setIsLoading(true);
    const res = await getMyDcpReportId(data?.id);
    const res1: any = await getClass();
    if (res?.status === 200 && res1?.status == 200) {
      const resList = res?.data?.dcpClassReports;
      setListClass(res1?.data.items)
      onHandleSaveRedux(res1?.data.items, resList)

      setListClassReport(resList);

      const listClassReportApi = resList.filter((item: any) => item.faults.length > 0)
      setListClassReportState(listClassReportApi)
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (dcpReportHistory?.dcpClassReports.length != 0) {
      const dataFound = dcpReportHistory?.dcpClassReports.find(item => item?.faults.length != 0)
      if (dataFound?.classId || isFirst > 0) {
        const listClassReportApi = dcpReportHistory?.dcpClassReports.filter((item: any) => item.faults.length > 0)
        setListClassReportState(listClassReportApi)
        setListClassReport(dcpReportHistory);
      }
    }
    setIsFirst(isFirst + 1);
  }, [dcpReportHistory?.dcpClassReports, dcpReportHistory])

  const onHandleSaveRedux = (listClass: Class[], resList: any) => {
    var listClassMistake = listClass.map(item => {
      return {
        classId: item.id,
        faults: [] as Faults[]
      }
    })
    listClassMistake.map((item: any, index: number) => {
      resList.map((item1: any) => {
        if (item1?.classId == item?.classId) {
          var dataFaults: Faults[] = [];
          item1?.faults.map((item3: any) => {
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
    const dcpClassReports = {
      dcpClassReports: listClassMistake
    }
    dispatch(addClassMistakeHistory(dcpClassReports))
  }

  const _renderClass = (item: DcpClassesReport, index: number) => {
    const classInfo = listClass.find(classItem => classItem.id === item.classId)
    const className: any = classInfo?.name
    const faultsInfo = item.faults.map((item: any) => {
      const faultInfo = listRegulationApi.find(fault => fault.id === item.regulationId)
      return {
        regulationName: faultInfo?.name,
        point: faultInfo?.point,
        relatedStudentIds: item?.relatedStudents || item?.relatedStudentIds
      }
    })
    const totalFault = faultsInfo?.length
    const totalPoint = faultsInfo.reduce(((acc: number, cur: any) => acc + (cur?.relatedStudentIds?.length > 0 ? cur?.point * cur?.relatedStudentIds?.length : cur?.point)), 0)
    return (
      <TouchableOpacity style={styles.itemContainer} key={index}
        onPress={() => {
          // onHandleSaveRedux();
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ClassReportListHistory',
              params: { classInfo, data }
            })
          )
        }}
      >
        <View style={styles.itemClassContainer}>
          <Text style={styles.itemClassName}>{className ? className : "Lớp"}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>
            Tổng điểm:
            <Text style={styles.content}>{showPoint(-totalPoint)}</Text>
          </Text>
          <Text style={styles.contentTitle}>
            Số quy định đã chấm:
            <Text style={styles.content}>{`  ${totalFault}`}</Text>
          </Text>
        </View>
        <View style={styles.iconDetailContainer}>
          {
          <AntDesign
              name={'right'}
              color={"blue"}
              size={24}
            /> }
        </View>
      </TouchableOpacity>
    )
  }

  const EditDcReport = async () => {
    try {
      // const res = await postDcpReport(dcpReport);
      const listDcReport = dcpReportHistory.dcpClassReports.filter(item => item?.faults.length != 0)
      const requestDcReport = { dcpClassReports: listDcReport }
      const res = await putEditDcpReport(requestDcReport, data?.id);
      if (res) {
        Alert.alert("Thành công", "Cập nhật phiếu chấm thành công", [
          {
            text: "OK", onPress: () => {
              navigation.goBack();
              const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(dcpReportHistory?.dcpClassReports))
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
      <LoadingBase visible={isLoading} />
      <Header title="Thông tin phiếu chấm nề nếp" />
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        <ScrollView>
          {listClassReportState.map((item: any, index: number) => _renderClass(item, index))}
        </ScrollView>
        {data?.status == "Created" ?
          <TouchableOpacity disabled={isEmpty}
            onPress={() => { EditDcReport() }}
            style={[mainStyle.buttonContainer, styles.buttonAdd, { backgroundColor: isEmpty ? 'gray' : color.blueStrong }]}>
            <FontAwesome
              name={'send-o'}
              color={"white"}
              size={24}
            />
            <Text style={[mainStyle.buttonTitle, { fontSize: 18, marginHorizontal: 12 }]}>Cập nhật phiếu chấm</Text>
          </TouchableOpacity> : null}
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
    borderWidth: 1,
    borderColor: color.border,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
  },
  itemClassContainer: {
    width: widthDevice * 25 / 100,
    height: 70,
    backgroundColor: color.blue,
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
    marginLeft: 8,
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
  iconDetailContainer: {
    justifyContent: 'center',
    marginRight: 10
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    marginBottom: 20,
    width: widthDevice * 92 / 100,
    flexDirection: 'row'
  }
})