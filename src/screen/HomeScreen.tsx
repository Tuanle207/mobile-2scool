import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Image, StyleSheet, Dimensions, Text, TextInput, TouchableOpacity, View, FlatList, Alert, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { getClass } from '../api/class'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import HeaderHome from '../component/HeaderHome'
import { Class } from '../model/Class'
import { RootState } from '../redux/reducer'

const HomeScreen = () => {
  const navigation = useNavigation()
  const token = useSelector((state: RootState) => state.auth.access_token)
  const [search, setSearch] = useState('')
  const [classes, setClasses] = useState<Class[]>([])

  useEffect(() => {
    initClass()
  }, [])

  const initClass = async () => {
    try {
      const res: any = await getClass(token)
      setClasses(res.data.items)
    } catch (err) {
      Alert.alert("Error")
    }
  }

  const _renderItem = (item: Class) => {
    return (
      <View style={styles.classContainer}>
        <Text style={styles.class}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => initClass()}>
          <Image source={require('../assets/icon/edit.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome
        title="Trang chủ"
      />
      <View style={styles.mainContainer}>
        <Text style={styles.mainTitle}>Danh sách chấm vi phạm</Text>
        <View style={styles.searchInput}>
          <Image source={require('../assets/icon/search.png')} style={styles.iconSearch} />
          <TextInput
            placeholder="Nhập tên lớp"
            placeholderTextColor={color.placeholder}
            value={search}
            onChangeText={(value: string) => setSearch(value)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={classes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => _renderItem(item)}
            style={{}}
          />
        </View>

      </View>
    </SafeAreaView>
  )
}


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.background
  },
  mainTitle: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
    marginTop: 20,
  },
  iconSearch: {
    marginRight: 10
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width * 80 / 100,
    height: 45,
    backgroundColor: 'white',
    color: 'black',
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 15
  },
  classContainer: {
    width: width * 80 / 100,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height: 55,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  class: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
  }
});

export default HomeScreen