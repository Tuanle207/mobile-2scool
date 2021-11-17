import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import Header from '../component/Header'
import { mainStyle } from './mainStyle'

const LrReport = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [point, setPoint] = useState('')
  const [absent, setAbsent] = useState('')

  const _renderImage = () => {
    return (
      <View style={styles.iamgeContainer}>
        <Text style={styles.title}>Ảnh sổ đầu bài</Text>
        <TouchableOpacity style={styles.image}>
          <Text style={styles.iconPlus}>+</Text>
          <Text style={styles.titleButtonImage}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { }}
          style={[mainStyle.buttonContainer, styles.buttonAdd]}>
          <Text style={mainStyle.buttonTitle}>Kiểm tra ảnh</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _renderPoint = () => {
    return (
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Điểm sổ đầu bài</Text>
        <TextInput
          value={point}
          onChangeText={(text: string) => setPoint(text)}
          keyboardType='numeric'
          placeholder="Điểm sổ đầu bài"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>
    )
  }

  const _renderAbsent = () => {
    return (
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Tổng số buổi vắng</Text>
        <TextInput
          value={absent}
          onChangeText={(text: string) => setAbsent(text)}
          keyboardType='numeric'
          placeholder="Tổng số buổi vắng"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thêm vi phạm" />
      <View style={styles.mainContainer}>
        {_renderImage()}
        {_renderPoint()}
        {_renderAbsent()}
      </View>
      <TouchableOpacity
        onPress={() => { }}
        style={[mainStyle.buttonContainer, styles.buttonSend]}>
        <Text style={mainStyle.buttonTitle}>Gửi phiếu thành tích</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  buttonAdd: {
    height: 35,
    width: '45%'
  },
  title: {
    fontSize: fontSize.contentSmall,
    marginBottom: 10
  },
  iamgeContainer: {
    marginTop: 40
  },
  pointContainer: {
    marginTop: 25
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.border
  },
  buttonSend: {
    marginBottom: 20,
    marginHorizontal: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: color.border,
    marginBottom: 15,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  iconPlus : {
    color: color.border,
    fontSize: 50,
    flex: 3,
  },
  titleButtonImage: {
    color: color.border,
    fontWeight: 'bold',
    fontSize: fontSize.title,
    flex: 2
  }
})

export default LrReport