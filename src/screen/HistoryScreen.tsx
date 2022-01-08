import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { delDcpReportsId, getAllDcpReports } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import HeaderHome from '../component/HeaderMain'
import usePagingInfo from '../ultil/usePagingInfo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LoadingBase from '../component/LoadingBase'
import { convertStatus, convertStatusColor } from '../utilities/convertData'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/reducer'
import { DcpClassesReport, Faults } from '../redux/reducer/mistakeHistory'
import { addClassMistakeHistory } from '../redux/action/mistakeHistory'
const HistoryScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const roleUser = useSelector((state: RootState) => state.roleUser)
  const dcpReportHistory = useSelector((state: RootState) => state.mistakeHistory)
  const [dateFromPicker, setDateFromPicker] = useState(false)
  const [dateToPicker, setDateToPicker] = useState(false)
  const [datePicker, setDatePicker] = useState(false)
  const [listDcpReport, setListDcpReport] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chooseDateStart, setChooseDateStart] = useState(new Date( moment().add(-6, 'd').format('YYYY-MM-DD')).toISOString());
  const [chooseDateEnd, setChooseDateEnd] = useState(new Date().toISOString());
  const { pagingInfo, setPageIndex, setFilter } = usePagingInfo({
    filter: [
      {
        key: 'Status',
        comparison: 'In',
        value: 'Created,Approved,Rejected'
      },
      {
        key: 'CreationTime',
        comparison: '>=',
        value: moment().add(-6, 'd').format('MM/DD/YYYY')
      },
      {
        key: 'CreationTime',
        comparison: '<',
        value: moment().add(1, 'd').format('MM/DD/YYYY')
      }
    ]
  });

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getHistoryDcpReports()
    }, [pagingInfo]),
  );

  const getHistoryDcpReports = async () => {
    setIsLoading(true);
    const input = {
      pageIndex: 1,
      pageSize: 10,
      sortName: '',
      filter: pagingInfo.filter
    }
    const res = await getAllDcpReports(input)
    if (res?.status === 200) {
      setIsLoading(false)
      setListDcpReport(res.data?.items)
    }
    setIsLoading(false)
  }

  const _renderDatePicker = () => {
    return (
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => setDateFromPicker(true)} style={styles.touchChooseDate}>
          <TextInput
            value={moment(chooseDateStart).format("DD/MM/YYYY") }
            editable={false}
            style={styles.datePicker}
            textAlign="center"
          />
          <FontAwesome
            name={'calendar'}
            color={color.blueStrong}
            size={20}

          />
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center' }}>_______</Text>
        <TouchableOpacity onPress={() => setDateToPicker(true)} style={styles.touchChooseDate}>
          <TextInput
            value={moment(chooseDateEnd).format("DD/MM/YYYY")}
            editable={false}
            style={styles.datePicker}
            textAlign="center"
          />
          <FontAwesome
            name={'calendar'}
            color={color.blueStrong}
            size={20}

          />
        </TouchableOpacity>
      </View>
    )
  }

  const onHanldeDel = async (value: any) => {
    const arrayDel = listDcpReport.filter((item: any) => item?.id !== value?.id)
    setListDcpReport(arrayDel);
    const res = await delDcpReportsId(value?.id);
  }

  const _renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity onPress={() => {
        if (dcpReportHistory.dcpClassReports.length != 0) {
          const newListClassReport: DcpClassesReport[] = JSON.parse(JSON.stringify(dcpReportHistory?.dcpClassReports))
          newListClassReport.map((item: DcpClassesReport, index: number) => {
            newListClassReport[index].faults = [];
          })
          dcpReportHistory.dcpClassReports = newListClassReport
          dispatch(addClassMistakeHistory(dcpReportHistory))
        }
        navigation.dispatch(
          CommonActions.navigate({
            name: 'HistoryInfo',
            params: item

          })
        )
      }}
        style={styles.itemContainer} key={index}>
        <View style={styles.infoContainer}>
          <Text style={styles.dateTime}>{`Phiếu chấm ngày ${moment(item?.creationTime).format("DD/MM/YYYY")}`}</Text>
          <View style={styles.line2Container}>
            <View style={styles.timeContainer}>
              <Image source={require('../assets/icon/clock.png')} />
              <Text style={styles.line2Content}>{moment(item?.creationTime).format("hh:mm a")}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Image source={require('../assets/icon/status.png')} />
              <Text style={[styles.line2Content, { color: convertStatusColor(item?.status) }]}>{convertStatus(item?.status)}</Text>
            </View>
          </View>
        </View>
        {item?.status == "Created" ?
          <TouchableOpacity onPress={() => onHanldeDel(item)} disabled={item?.status === "Created" ? false : true}>

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

  if(!roleUser?.CreateNewDcpReport &&roleUser?.CreateNewLRReport)
{return(
  <SafeAreaView style={styles.container}>    
     <HeaderHome title="Lịch sử chấm" />
      <Text style={{alignSelf:'center', marginTop:10, textAlignVertical:'center', fontStyle:'italic'}}>Bạn không có quyền truy cập</Text>
      </SafeAreaView>
)}
  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome title="Lịch sử chấm" />
      <LoadingBase visible={isLoading} />
      {_renderDatePicker()}
      <DatePicker
        modal
        open={dateFromPicker}
        date={new Date(chooseDateStart)}
        maximumDate={new Date()}
        mode={"date"}
        onConfirm={(date) => {

          setDateFromPicker(false);
          setChooseDateStart(new Date(date).toISOString())
          setFilter({
            key: 'CreationTime',
            comparison: '>=',
            value: moment(date).format('MM/DD/YYYY')
          });
        }}
        onCancel={() => {
          setDateFromPicker(false)
        }}
        title={"Chọn ngày bắt đầu"}
        cancelText={"Thoát"}
        confirmText={"Chọn"}
        locale={"vi"}
      />
      <DatePicker
        modal
        open={dateToPicker}
        date={new Date(chooseDateEnd)}
        mode={"date"}
        onConfirm={(date) => {

          setDateToPicker(false);
          setChooseDateEnd(new Date(date).toISOString())
          setFilter({
            key: 'CreationTime',
            comparison: '<',
            value: moment(date).add(1, 'd').format('MM/DD/YYYY')
          });

        }}
        locale={"vi"}
        onCancel={() => {
          setDateToPicker(false)
        }}
        title={"Chọn ngày kết thúc"}
        cancelText={"Thoát"}
        confirmText={"Chọn"}
      />
      <ScrollView>
        {listDcpReport.length !== 0 ?
          listDcpReport.map((item, index) => _renderItem(item, index)) : <Text style={{ alignSelf: 'center', fontStyle: 'italic', marginTop: 10 }}>Danh sách trống</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background
  },
  iconRemove: {
    tintColor: 'gray',
    width: 26,
    height: 26,
    marginRight: 5
  },
  itemContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: '4%',
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1
  },
  dateTime: {
    fontSize: fontSize.content,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5
  },
  line2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10
  },
  line2Content: {
    fontSize: fontSize.contentSmall,
    marginLeft: 8
  },
  timeContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: "3%",
    alignItems: 'center',
    marginTop: 20
  },
  datePicker: {
    color: color.blueStrong,
    backgroundColor: 'white',
    height: 40,
    borderColor: color.border,
    // borderWidth: 1,
    width: widthDevice * 30 / 100,
    borderRadius: 10,

  },
  touchChooseDate: {
    backgroundColor: "white",
    flexDirection: 'row',
    paddingRight: 16,
    paddingVertical: 2,
    alignItems: 'center',
    borderRadius: 10,
  }
});

export default HistoryScreen