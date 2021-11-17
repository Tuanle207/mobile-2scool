import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import Header from '../component/Header'
import { addClassMistake } from '../redux/action/mistake'
import { RootState } from '../redux/reducer'
import { DcpClassesReport, DcpReport, Faults } from '../redux/reducer/mistake'
import { mainStyle } from './mainStyle'

interface FaultInfo {
  regulationName: string,
  point: number,
  relatedStudentIds: string[],
}

const ClassReportList = () => {
  const dispatch = useDispatch()
  const dcpReport = useSelector((state: RootState) => state.mistake)
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const navigation = useNavigation()
  const route = useRoute()
  const classInfo: any = route.params
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
    dispatch(addClassMistake(newDcpReport))
  }

  const _renderMistake = (item: FaultInfo, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'MistakeDetail',
            params: {
              classInfo: classInfo,
              fault: item,
              indexFault: index
            }
          })
        )}
        style={styles.item} key={index}>
        <View style={styles.itemPoint}>
          <Text style={styles.point}>{`- ${item.point * item.relatedStudentIds.length}`}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.content}>{item.regulationName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeMistake(index)}
        >
          <Image source={require('../assets/icon/remove.png')} style={styles.iconRemove} />
        </TouchableOpacity>
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
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(
              CommonActions.navigate({
                name: 'HomeScreen',
              })
            )}
            style={[mainStyle.buttonContainer, styles.buttonDone]}>
            <Text style={mainStyle.buttonTitle}>Xong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.dispatch(
              CommonActions.navigate({
                name: 'MistakeCreate',
                params: classInfo
              })
            )}
            style={[mainStyle.buttonContainer, styles.buttonAdd]}>
            <Text style={mainStyle.buttonTitle}>Thêm vi phạm</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 20,
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
    backgroundColor: color.blue,
    width: '40%'
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    marginLeft: 20,
  },
})

export default ClassReportList