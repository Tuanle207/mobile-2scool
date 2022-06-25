import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { useDispatch, useSelector } from 'react-redux'
import { getStudent } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, heightDevice, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { Student } from '../model/Mistake'
import { addClassMistake } from '../redux/action/mistake'
import { RootState } from '../redux/reducer'
import { DcpReport } from '../redux/reducer/mistake'
import { mainStyle } from './mainStyle'
import { Regulation} from '../model/Mistake'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const MistakeCreate = () => {
  const navigation = useNavigation()
  const dcpReport = useSelector((state: RootState) => state.mistake)
  const listRegulation = useSelector((state: RootState) => state.regulation)
  const listCriteria = useSelector((state: RootState) => state.criteria)
  const [listRegulation1, setListRegulation1] = useState<Regulation[]>([])
  const dispatch = useDispatch()
  const route = useRoute()
  const { classInfo, fault, indexFault }: any = route.params
  const [listStudent, setListStudent] = useState<Student[]>([])
  const [listPicker, setListPicker] = useState<any[]>([])
  const [criteria, setCriteria] = useState('')
  const [regulation, setRegulation] = useState(fault.regulationId)
  const [regulationName, setRegulationName] = useState(fault.regulationName)
  const [studentMistake, setStudentMistake] = useState<Student[]>(fault.relatedStudentIds)
  const [modalType, setModalType] = useState<string | null>(null)
  const [point, setPoint] = useState(fault.point)

  useEffect(() => {
    initStudent()
  }, [])
  useEffect(()=>{
  const dataRegulation:any = listRegulation.find(item => item.id === fault?.regulationId);
  setCriteria(dataRegulation?.criteriaId);
  setListRegulation1(listRegulation.filter((item:any) => item.criteriaId === dataRegulation?.criteriaId));
  },[])


  const initStudent = async () => {
    try {
      const res: any = await getStudent(classInfo.id)
      setListStudent(res.data.students)
    } catch (err) {
      Alert.alert('Error')
    }
  }
  useEffect(() => {
    if (criteria === '') setListRegulation1([])
    else setListRegulation1(listRegulation.filter(item => item.criteriaId === criteria))
  }, [criteria])

  const editMistake = () => {
    if (regulation === '') return Alert.alert('Thông báo', 'Vui lòng chọn vi phạm')
    const mistake = {
      regulationId: regulation,
      regulationName: regulationName,
      relatedStudentIds: studentMistake,
      point: point
    }
    const newDcpReport: DcpReport = JSON.parse(JSON.stringify(dcpReport))
    const classMistake: any = newDcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
    const indexClassMistake = newDcpReport.dcpClassReports.findIndex(item => item.classId === classInfo.id)
    classMistake.faults.splice(indexFault, 1, mistake)
    const newDcpClassReports = newDcpReport.dcpClassReports
    newDcpClassReports[indexClassMistake] = classMistake
    newDcpReport.dcpClassReports = newDcpClassReports
    dispatch(addClassMistake(newDcpReport))
    navigation.goBack()
  }

  const onSelectCriteria = (e: any) => {
    setCriteria(e[0])
  }

  const onSelectRegulation = (e: any) => {
    setRegulation(e[0])
  }

  const onSelectStudentChange = (e: any) => {
    setStudentMistake(e)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chi tiết vi phạm" />
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
      <View style={[styles.contentContainer,{paddingLeft: 16, paddingRight: 16}]}>
          <MultiSelect
            fixedHeight
            single
            styleMainWrapper={styles.criteria}
            items={listCriteria}
            uniqueKey='id'
            onSelectedItemsChange={onSelectCriteria}
            selectedItems={[criteria]}
            selectText='Tiêu chí'
            searchInputPlaceholderText='Tên tiêu chí'
            styleTextDropdown={styles.criteriaName}
            styleTextDropdownSelected={styles.criteriaName}
            onChangeInput={(text) => console.warn(text)}
            tagRemoveIconColor='gray'
            tagBorderColor='gray'
            tagTextColor='black'
            selectedItemTextColor='red'
            selectedItemIconColor='red'
            itemTextColor='#000'
            displayKey='name'
            submitButtonColor='#2CC97E'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />

          <MultiSelect
            fixedHeight
            single
            styleMainWrapper={styles.criteria}
            items={listRegulation1}
            uniqueKey='id'
            onSelectedItemsChange={onSelectRegulation}
            selectedItems={[regulation]}
            selectText='Tên vi phạm'
            searchInputPlaceholderText='Tên vi phạm'
            noItemsText='Vui lòng chọn tiêu chí'
            styleTextDropdown={styles.criteriaName}
            styleTextDropdownSelected={styles.criteriaName}
            onChangeInput={(text) => console.log(text)}
            tagRemoveIconColor='gray'
            tagBorderColor='gray'
            tagTextColor='black'
            selectedItemTextColor='red'
            selectedItemIconColor='red'
            itemTextColor='#000'
            displayKey='name'
            submitButtonColor='#2CC97E'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />

          <MultiSelect
            items={listStudent}
            uniqueKey='id'
            styleMainWrapper={styles.studentContainer}
            onSelectedItemsChange={onSelectStudentChange}
            selectedItems={studentMistake}
            selectText='Học sinh vi phạm'
            searchInputPlaceholderText='Tên học sinh'
            styleTextDropdown={styles.criteriaName}
            styleTextDropdownSelected={styles.criteriaName}
            onChangeInput={(text) => console.warn(text)}
            tagRemoveIconColor='gray'
            tagBorderColor='gray'
            tagTextColor='black'
            selectedItemTextColor='red'
            selectedItemIconColor='red'
            itemTextColor='#000'
            displayKey='name'
            submitButtonColor='#2CC97E'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />

        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => editMistake()}
        style={[mainStyle.buttonContainer, styles.buttonAdd]}>
          <MaterialCommunityIcons
          name={'update'}
          color={"white"}
          size={30}
        />
        <Text style={[mainStyle.buttonTitle,{ fontSize: 18, marginHorizontal: 12 }]}>Cập nhật</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: 'center',
    height: heightDevice
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.background,
  },
  contentContainer: {
    flex: 1,
    width: widthDevice,
  },
  criteria: {
    marginTop: '4%',
    width: widthDevice * 92 / 100,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    // borderWidth: 0.5,
    paddingLeft: 16,
    paddingRight: 4,
  },
  criteriaName: {
    fontSize: 16,
    fontWeight: 'bold',
    height: 21,
    color: 'black',
    marginTop: 0,
    marginBottom: 0,
  },
  iconNext: {

  },
  studentList: {
    flex: 1,
    alignItems: 'flex-start',
  },
  studentContainer: {
    marginTop: '4%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 5,
    width: widthDevice * 92 / 100,
    minHeight: 360
  },
  studentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    fontSize: fontSize.contentSmall,
    marginRight: 5
  },
  student: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.border,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  containerModalSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.blackOpacity,
  },
  wrappScrollView: {
    maxHeight: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContent: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    alignItems: 'center'
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    flexDirection: 'row',
    marginBottom: 10,
     width:  widthDevice * 92 / 100,
  }
})

export default MistakeCreate