import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { getClass } from '../api/class'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import HeaderHome from '../component/HeaderMain'
import { Class } from '../model/Class'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [classId, setClassId] = useState('')
  const [listClass, setListClass] = useState<Class[]>([])

  useEffect(() => {
    initClass()
  }, [])

  useEffect(() => {
    if (listClass.length > 0) {
      setClassId(listClass[0].id)
    }
  }, [listClass])

  const initClass = async () => {
    try {
      const res: any = await getClass();
      setListClass(res.data.items)
    } catch (err) {
      Alert.alert("Error", "Can not get list class")
      console.log(err)
    }
  }

  const onSelectClass = (e: any) => {
    setClassId(e[0])
    console.log('keytest', e[0])
  }

  const _renderItem = () => {
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
      <ScrollView>
        {_renderItem()}
        {_renderItem()}
        {_renderItem()}
        {_renderItem()}
      </ScrollView>
      <View style={styles.iconAddContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'LrReport',
            params: { classId: classId }
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
  iconAddContainer: {
    alignItems: 'flex-end'
  },
  iconAdd: {
    width: 55,
    height: 55,
    margin: 30
  },
  className: {
    fontSize: fontSize.contentSmall,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 0,
    marginLeft: '10%'
  },
});

export default HomeScreen