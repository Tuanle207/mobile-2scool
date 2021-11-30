import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, SafeAreaView, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, Alert, View, Platform, ScrollView } from 'react-native'
import { color } from '../assets/color'
import { fontSize, heightDevice, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { mainStyle } from './mainStyle'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { launchImageLibrary } from 'react-native-image-picker';
import { postCreateLrReports } from '../api/mistake'
import { getClassLrReport } from '../api/class'
const { height, width } = Dimensions.get('screen')
const LrReport = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [point, setPoint] = useState('')
  const [absent, setAbsent] = useState('')
  const [listImage, setListImage] = useState<any>({})
  const chooseFile = () => {
    let options: any = {
      title: 'Select Image',
      includeBase64: true,
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response: any) => {

      if (response?.didCancel) {
        console.log('User cancelled image picker');
      } else if (response?.error) {
        console.log('ImagePicker Error: ', response?.error);
      } else if (response?.customButton) {
        console.log('User tapped custom button: ', response?.customButton);
      } else {
        var source: any = response?.assets[0];
        // let base64 = 'data:image/jpeg;base64,' + source?.base64;
        setListImage(source)
      }
    });
  };
  const hanldeDelImage = () => {
    setListImage({});
  }

  const onHanldeSendAchieve = async () => {
    if (checkData()) {
      const res: any = await getClassLrReport();
      console.log("res", res?.data)
      const objectImage: any = listImage;
      if (res?.data?.items[0]?.id) {
        let s = { uri: objectImage?.uri, name: objectImage?.fileName, type: objectImage?.type };
        let formData = new FormData();
        formData.append('ClassId', "9a0d26bf-3a1e-0b55-3385-39ff62e91b22");
        formData.append('AbsenceNo', Number(absent));
        formData.append('TotalPoint', Number(point));
        formData.append('Photo', s);
        const res1 = await postCreateLrReports(formData);
        console.log("res", res1)
        if (res1 && res1?.status === 200) {
          navigation.goBack()
        } else { Alert.alert("Thất bại", "Tạo mới thất bại") }
      } else { Alert.alert("Thất bại", "Tạo mới thất bại") }
    } else { Alert.alert("Thất bại", "Tạo mới thất bại") }
  }
  const checkData = () => {
    if (absent && point && listImage?.uri) return true;
    else return false
  }
  const _renderImage = () => {
    return (
      <View style={styles.iamgeContainer}>
        <Text style={styles.title}>Ảnh sổ đầu bài</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { chooseFile() }}
            style={[styles.image, { marginRight: 12 }]}>
            <Text style={styles.iconPlus}>+</Text>
            <Text style={styles.titleButtonImage}>Image</Text>
          </TouchableOpacity>
          <ScrollView style={{ height: 100, width: widthDevice - 130 }} horizontal>
            {listImage?.base64 &&
              <View style={styles.image}>
                <Image source={{ uri: `data:image/jpeg;base64,${listImage?.base64}` }} style={styles.image} />
                <TouchableOpacity onPress={() => hanldeDelImage()}
                  style={styles.delImage}>
                  <AntDesign
                    name={'closecircle'}
                    color={"white"}
                    size={24}
                  />
                </TouchableOpacity>
              </View>}
          </ScrollView>

        </View>

        <TouchableOpacity

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

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>

      <Header title="Thêm thành tích" />
      <ScrollView style={styles.mainContainer}>
        <View style={{ flex: 1, padding: 20, height: heightDevice - 175 }}>
          {_renderImage()}
          {_renderPoint()}
          {_renderAbsent()}
        </View>
        <TouchableOpacity
          onPress={() => { onHanldeSendAchieve() }}
          style={[mainStyle.buttonContainer, styles.buttonSend,]}>
          <FontAwesome
            name={'send-o'}
            color={"white"}
            size={24}
          />
          <Text style={[mainStyle.buttonTitle, { marginHorizontal: 12, fontSize: 18 }]}>Gửi phiếu thành tích</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  mainContainer: {
    flex: 1,
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
    marginTop: 50,
    alignSelf: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    width: '92%', alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: color.border,
    marginBottom: 15,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  iconPlus: {
    color: color.border,
    fontSize: 50,
    flex: 3,
  },
  titleButtonImage: {
    color: color.border,
    fontWeight: 'bold',
    fontSize: fontSize.title,
    flex: 2
  },
  delImage: { position: 'absolute', top: 0, right: 0 }
})

export default LrReport