import { useNavigation } from '@react-navigation/native'
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

const HomeScreen = () => {
  const navigation = useNavigation()
  const [dateFromPicker, setDateFromPicker] = useState(false)
  const [dateToPicker, setDateToPicker] = useState(false)
  const [datePicker, setDatePicker] = useState(false)
  const [listDcpReport, setListDcpReport] = useState([])

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
    const input = {
      pageIndex: 1,
      pageSize: 10,
      sortName: '',
      filter: pagingInfo.filter
    }
    const res = await getAllDcpReports(input)
    setListDcpReport(res.data)
  }

  const _renderDatePicker = () => {
    return (
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => setDateFromPicker(true)}>
          <TextInput
            value={pagingInfo.filter ? pagingInfo.filter[2].value.toString() : ''}
            editable={false}
            style={styles.datePicker}
            textAlign="center"
          />
        </TouchableOpacity>
        <Text>_______</Text>
        <TouchableOpacity onPress={() => setDateToPicker(true)}>
          <TextInput
            value={pagingInfo.filter ? pagingInfo.filter[3].value.toString() : ''}
            editable={false}
            style={styles.datePicker}
            textAlign="center"
          />
        </TouchableOpacity>
      </View>
    )
  }

  const _renderItem = (item: any) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.dateTime}>{`Phiếu chấm ngày ${'2021'}`}</Text>
          <View style={styles.line2Container}>
            <View style={styles.timeContainer}>
              <Image source={require('../assets/icon/clock.png')} />
              <Text style={styles.line2Content}>{`07:15 AM`}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Image source={require('../assets/icon/status.png')} />
              <Text style={[styles.line2Content, { color: 'red' }]}>{`Đã duyệt`}</Text>
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
      <HeaderHome title="Lịch sử chấm" />
      {_renderDatePicker()}
      <DatePicker
        modal
        open={dateFromPicker}
        date={new Date()}
        onConfirm={(date) => {
          setFilter({
            key: 'StartDate',
            comparison: '==',
            value: moment(date).format('MM/DD/YYYY')
          });
          setDateFromPicker(false)
        }}
        onCancel={() => {
          setDateFromPicker(false)
        }}
      />
      <DatePicker
        modal
        open={dateToPicker}
        date={new Date()}
        onConfirm={(date) => {
          setFilter({
            key: 'EndDate',
            comparison: '==',
            value: moment(date).format('MM/DD/YYYY')
          });
          setDateToPicker(false)
        }}
        onCancel={() => {
          setDateToPicker(false)
        }}
      />
      <ScrollView>
        {listDcpReport.map(item => _renderItem(item))}
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
    marginHorizontal: '10%',
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
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    alignItems: 'center',
    marginTop: 20
  },
  datePicker: {
    color: 'black',
    backgroundColor: 'white',
    height: 40,
    borderColor: color.border,
    borderWidth: 1,
    width: widthDevice * 30 / 100,
    borderRadius: 3
  }
});

export default HomeScreen