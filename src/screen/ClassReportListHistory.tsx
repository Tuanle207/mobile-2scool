import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import Header from '../component/Header'
import { addClassMistake } from '../redux/action/mistake'
import { addClassMistakeHistory } from '../redux/action/mistakeHistory'
import { RootState } from '../redux/reducer'
import { DcpClassesReport, DcpReport, Faults } from '../redux/reducer/mistakeHistory'
import { mainStyle } from './mainStyle'
import AntDesign from 'react-native-vector-icons/AntDesign'

interface FaultInfo {
  regulationName: string,
  point: number,
  relatedStudentIds: string[],
}

const ClassReportListHistory = () => {
  const dispatch = useDispatch()
  const dcpReport = useSelector((state: RootState) => state.mistakeHistory)
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const navigation = useNavigation()
  const route = useRoute()
  const { classInfo, data }: any = route.params
  console.log("ClassReportListHistory", data)
  const faultsClass: any = dcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
  const faultsInfo = faultsClass.faults.map((item: Faults) => {
    const faultInfo = listRegulationApi.find(fault => fault.id === item.regulationId)
    return {
      regulationName: faultInfo?.name,
      point: faultInfo?.point,
      regulationId: item.regulationId,
      relatedStudentIds: item.relatedStudentIds
    }
  })
  const listPointOfFault = faultsInfo.map((item: FaultInfo) => {
    if (item.relatedStudentIds.length == 0) {
      return item.point
    } else
      return item.point * item.relatedStudentIds.length
  })
  const totalPoint = listPointOfFault.reduce(((acc: number, cur: number) => acc + cur), 0)

  const removeMistake = (index: number) => {
    const newDcpReport: DcpReport = JSON.parse(JSON.stringify(dcpReport))
    const classMistake: any = newDcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
    const indexClassMistake = newDcpReport.dcpClassReports.findIndex(item => item.classId === classInfo.id)
    classMistake.faults.splice(index, 1)
    const newDcpClassReports = newDcpReport.dcpClassReports
    newDcpClassReports[indexClassMistake] = classMistake
    newDcpReport.dcpClassReports = newDcpClassReports
    dispatch(addClassMistakeHistory(newDcpReport))
  }

  const _renderMistake = (item: FaultInfo, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'MistakeDetailHistory',
            params: {
              classInfo: classInfo,
              fault: item,
              indexFault: index,
              data: data
            }
          })
        )}
        style={styles.item} key={index}>
        <View style={styles.itemPoint}>
          <Text style={styles.point}>{item.relatedStudentIds.length !== 0 ? `- ${item.point * item.relatedStudentIds.length}` : `- ${item.point}`}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.content}>{item.regulationName}</Text>
        </View>
        {data?.status == 'Created' ?
          <TouchableOpacity
            onPress={() => removeMistake(index)} style={styles.pd10}
          >
            <AntDesign
              name={'closecircleo'}
              color={"red"}
              size={24}
            />
          </TouchableOpacity>
          : null}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Vi phạm" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{`Danh sách vi phạm ${classInfo.name}`}</Text>
          <Text style={styles.totalPoint}>Tổng điểm trừ:
            <Text style={styles.point}>{` - ${totalPoint}`}</Text>
          </Text>
          {faultsInfo?.map((item: FaultInfo, index: number) => _renderMistake(item, index))}
        </View>
        {data?.status == 'Created' ?
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()
              }
              style={[mainStyle.buttonContainer, styles.buttonDone]}>
              <Text style={mainStyle.buttonTitle}>Xong</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.dispatch(
                CommonActions.navigate({
                  name: 'MistakeCreateHistory',
                  params: classInfo
                })
              )}
              style={[mainStyle.buttonContainer, styles.buttonAdd]}>
              <Text style={mainStyle.buttonTitle}>Thêm vi phạm</Text>
            </TouchableOpacity>
          </View> : null}
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
  },
  totalPoint: {
    fontSize: fontSize.contentSmall,
    fontWeight: 'bold',
    marginTop: 16,
  },
  point: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: fontSize.contentSmall,
  },
  item: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  itemPoint: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  itemContent: {
    justifyContent: 'center',
    flex: 1
  },
  content: {
    fontSize: fontSize.contentSmall,
    color: 'grey'
  },
  iconRemove: {
    tintColor: 'gray',
    width: 26,
    height: 26,
    marginRight: 25
  },
  footerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  buttonDone: {
    backgroundColor: color.green,
    width: '40%'
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    marginLeft: 20,
  },
  pd10: {
    padding: 10,
  },
})

export default ClassReportListHistory