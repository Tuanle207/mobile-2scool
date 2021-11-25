import { useNavigation, CommonActions } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { getAllDcpReports } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
import HeaderHome from '../component/HeaderMain'
import usePagingInfo from '../ultil/usePagingInfo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LoadingBase from '../component/LoadingBase'
const AchieveScreen = () => {
  const navigation = useNavigation()
  const [dateFromPicker, setDateFromPicker] = useState(false)
  const [dateToPicker, setDateToPicker] = useState(false)
  const [datePicker, setDatePicker] = useState(false)
  const [listDcpReport, setListDcpReport] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pagingInfo, setPageIndex, setFilter } = usePagingInfo({
    filter: [
      {
        key: 'Status',
        comparison: '',
        value: 'Approved'
      },
      {
        key: 'Status',
        comparison: '',
        value: 'Rejected'
      },
      {
        key: 'StartDate',
        comparison: '==',
        value: moment().format('MM/DD/YYYY')
      },
      {
        key: 'EndDate',
        comparison: '!=',
        value: moment().add(10, 'days').calendar()
      }
    ]
  });

  useEffect(() => {
    getHistoryDcpReports()
  }, [pagingInfo])

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
            value={pagingInfo.filter ? pagingInfo.filter[2].value.toString() : ''}
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
            value={pagingInfo.filter ? pagingInfo.filter[3].value.toString() : ''}
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

  const _renderItem =  (item: any, index: number) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.line2Container}>
            <View style={styles.timeContainer}>
              <Image source={require('../assets/icon/date.png')} />
              <Text style={styles.line2Content}>{`03/10/2021`}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Image source={require('../assets/icon/status.png')} />
              <Text style={[styles.line2Content, { color: 'red' }]}>{`Đã duyệt`}</Text>
            </View>
          </View>
          <View style={styles.line2Container}>
            <View style={styles.timeContainer}>
              <Image source={require('../assets/icon/point.png')} />
              <Text style={styles.line2Content}>{`9.98`}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Image source={require('../assets/icon/absent.png')} />
              <Text style={styles.line2Content}>{`5`}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <TouchableOpacity
          // onPress={() => removeMistake(index)}
          >
            <Image source={require('../assets/icon/remove.png')} style={styles.iconRemove} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome title="Thành tích" />
      <LoadingBase visible={isLoading} />
      {_renderDatePicker()}
      <DatePicker
        modal
        open={dateFromPicker}
        date={new Date()}
        maximumDate={new Date()}
        mode={"date"}
        onConfirm={(date) => {
          setDateFromPicker(false);
          setFilter({
            key: 'StartDate',
            comparison: '==',
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
        date={new Date()}
        mode={"date"}
        onConfirm={(date) => {
          setDateToPicker(false);
          setFilter({
            key: 'EndDate',
            comparison: '==',
            value: moment(date).format('MM/DD/YYYY')
          });

        }}
        locale={"vi"}
        onCancel={() => {
          setDateToPicker(false)
        }}
        title={"Chọn ngày bắt đầu"}
        cancelText={"Thoát"}
        confirmText={"Chọn"}
      />
      <ScrollView>
        {listDcpReport.length !== 0 ?
          listDcpReport.map((item, index) => _renderItem(item, index)) : <Text style={{ alignSelf: 'center', fontStyle: 'italic', marginTop: 10 }}>Danh sách trống</Text>}
      </ScrollView>
      <View style={styles.iconAddContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'LrReport',
            // params: { classId: classId }
          })
        )}>
          <Image source={require('../assets/icon/plus.png')} style={styles.iconAdd} />
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
  },
  iconAddContainer: {
    alignItems: 'flex-end'
  },
  iconAdd: {
    width: 55,
    height: 55,
    margin: 30
  },
});

export default AchieveScreen