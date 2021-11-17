import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { useDispatch, useSelector } from 'react-redux'
import { getStudent } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, heightDevice, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { TYPE_PICKER } from '../constant'
import { Regulation, Student } from '../model/Mistake'
import { addClassMistake } from '../redux/action/mistake'
import { RootState } from '../redux/reducer'
import { DcpReport } from '../redux/reducer/mistake'
import { mainStyle } from './mainStyle'

const MistakeCreate = () => {
  const navigation = useNavigation()
  const dcpReport = useSelector((state: RootState) => state.mistake)
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const listCriteria = useSelector((state: RootState) => state.criteria)
  const dispatch = useDispatch()
  const route = useRoute()
  const classInfo: any = route.params

  const [listRegulation, setListRegulation] = useState<Regulation[]>([])
  const [listStudent, setListStudent] = useState<Student[]>([])
  const [criteria, setCriteria] = useState('')
  const [regulation, setRegulation] = useState('')
  const [studentMistake, setStudentMistake] = useState<Student[]>([])

  useEffect(() => {
    initStudent()
  }, [])

  useEffect(() => {
    if (criteria === '') setListRegulation([])
    else setListRegulation(listRegulationApi.filter(item => item.criteriaId === criteria))
  }, [criteria])


  const initStudent = async () => {
    try {
      const res: any = await getStudent(classInfo.id)
      setListStudent(res.data.students)
    } catch (err) {
      Alert.alert('Error')
    }
  }

  const addNewMistake = () => {
    if (regulation === '') return Alert.alert('Thông báo', 'Vui lòng chọn vi phạm')
    const mistake = {
      regulationId: regulation,
      relatedStudentIds: studentMistake,
    }
    const newDcpReport: DcpReport = JSON.parse(JSON.stringify(dcpReport))
    const classMistake: any = newDcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
    const indexClassMistake = newDcpReport.dcpClassReports.findIndex(item => item.classId === classInfo.id)
    classMistake.faults = [...classMistake.faults, mistake]
    const newDcpClassReports = newDcpReport.dcpClassReports
    newDcpClassReports[indexClassMistake] = classMistake
    newDcpReport.dcpClassReports = newDcpClassReports
    dispatch(addClassMistake(newDcpReport))
    navigation.goBack()
  }

  const onSelectStudentChange = (e: any) => {
    setStudentMistake(e)
  }

  const onSelectCriteria = (e: any) => {
    setCriteria(e[0])
  }

  const onSelectRegulation = (e: any) => {
    setRegulation(e[0])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thêm vi phạm" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
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
            submitButtonColor='#CCC'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />

          <MultiSelect
            fixedHeight
            single
            styleMainWrapper={styles.criteria}
            items={listRegulation}
            uniqueKey='id'
            onSelectedItemsChange={onSelectRegulation}
            selectedItems={[regulation]}
            selectText='Tên vi phạm'
            searchInputPlaceholderText='Tên vi phạm'
            noItemsText='Vui lòng chọn tiêu chí'
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
            submitButtonColor='#CCC'
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
            submitButtonColor='#CCC'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => addNewMistake()}
        style={[mainStyle.buttonContainer, styles.buttonAdd]}>
        <Text style={mainStyle.buttonTitle}>Thêm vi phạm</Text>
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
    flexDirection: 'column'
  },
  contentContainer: {
    flex: 1,
  },
  criteria: {
    marginTop: '15%',
    width: widthDevice * 80 / 100,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 5,
  },
  criteriaName: {
    fontSize: fontSize.contentSmall,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 0
  },
  iconNext: {

  },
  studentList: {
    flex: 1,
    alignItems: 'flex-start',
  },
  studentContainer: {
    marginTop: '15%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 5,
    width: widthDevice * 80 / 100,
    minHeight: 160
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
    marginBottom: 20,
    position: 'absolute',
    top: heightDevice - 70,
    width: '80%'
  }
})

export default MistakeCreate