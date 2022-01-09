import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, SafeAreaView, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, PermissionsAndroid, Alert, View, Platform, ScrollView } from 'react-native'
import { color } from '../assets/color'
import { fontSize, heightDevice, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { mainStyle } from './mainStyle'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { postCreateLrReports, postUpdateLrReports } from '../api/mistake'
import { getClassLrReport } from '../api/class'
import { baseUrl } from '../api/BaseApiService'
const { height, width } = Dimensions.get('screen')
interface bodyItem {
  absenceNo?: number,
  attachedPhotos?: string[],
  class?: { id?: string, name?: string },
  creationTime?: string,
  creatorId?: string,
  id?: string,
  status?: string,
  totalPoint?: number
}
const LrReport = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const item: bodyItem = route?.params;
  const [urlImage, setUrlImage] = useState(item?.attachedPhotos ? item?.attachedPhotos[0] : '')
  const [point, setPoint] = useState(item?.totalPoint != undefined && item?.totalPoint != null && item?.totalPoint != 0 ? `${item?.totalPoint}` : '')
  const [absent, setAbsent] = useState(item?.absenceNo != undefined && item?.absenceNo != null && item?.absenceNo != 0 ? `${item?.absenceNo}` : '')
  const [listImage, setListImage] = useState<any>({})

  const chooseFile = async () => {
    Alert.alert("Thêm hình ảnh", "Chọn hình ảnh từ thư viện hoặc chụp ảnh", [
      { text: "Chọn hình ảnh", onPress: () => requestCameraPermission(true) },
      {
        text: "Chụp ảnh",
        onPress: () => requestCameraPermission(false),
      },
    ]);
  };

  const requestCameraPermission = async (value: boolean) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (value) onLibImage();
          else onCameraImage();
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      if (value) onLibImage();
      else onCameraImage();
    }
  };
  const onCameraImage = () => {
    var options: any = {
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
    launchCamera(options, onFinishPickImage);
  };
  const onLibImage = () => {
    const options: any = {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, onFinishPickImage);
  };

  const onFinishPickImage = async ({ assets }: any) => {
    if (assets && assets?.length > 0) {
      const source = assets[0];
      setUrlImage('')
      setListImage(source)
    }
  };

  const hanldeDelImage = () => {
    if (urlImage) {
      setUrlImage('')
    }
    setListImage({});
  }

  const onHanldeUpdateAchieve = async () => {
    if (checkData()) {
      let s: any = {};
      const objectImage: any = listImage;
      let formData = new FormData();
      formData.append('ClassId', item?.class?.id);
      formData.append('AbsenceNo', Number(absent));
      formData.append('TotalPoint', Number(point));
      if (objectImage?.uri) {
        s = { uri: objectImage?.uri, name: objectImage?.fileName, type: objectImage?.type };
        formData.append('Photo', s);
      }
      const res1 = await postUpdateLrReports(formData, `${item?.id}`);
      if (res1 && res1?.status === 200) {
        navigation.goBack()
      } else { Alert.alert("Thất bại", "Cập nhật thất bại") }
    } else { Alert.alert("Thất bại", "Cập nhật thất bại, bạn chưa điền đầy đủ thông tin") }
  }

  const onHanldeSendAchieve = async () => {
    if (checkData()) {
      const res: any = await getClassLrReport();
      const objectImage: any = listImage;
      if (res?.data?.items[0]?.id) {
        let s = { uri: objectImage?.uri, name: objectImage?.fileName, type: objectImage?.type };
        // let s = { url: "http://10.0.2.2:5000/photo/d50650c8-25d0-319f-ff48-3a00817199d5-2021-11-30-12-15-16.png",name:"50650c8-25d0-319f-ff48-3a00817199d5-2021-11-30-12-15-16.png" , type:"image/png" };
        let formData = new FormData();
        formData.append('ClassId', res?.data?.items[0]?.id);
        formData.append('AbsenceNo', Number(absent));
        formData.append('TotalPoint', Number(point));
        formData.append('Photo', s);
        const res1 = await postCreateLrReports(formData);
        if (res1 && res1?.status === 200) {
          navigation.goBack()
        } else { Alert.alert("Thất bại", "Tạo mới thất bại") }
      } else { Alert.alert("Thất bại", "Tạo mới thất bại") }
    } else { Alert.alert("Thất bại", "Tạo mới thất bại, bạn chưa điền đầy đủ thông tin") }
  }
  const checkData = () => {
    if (absent && point && (listImage?.uri || urlImage)) return true;
    else return false
  }
  const _renderImage = () => {
    return (
      <View style={styles.iamgeContainer}>
        <Text style={styles.title}>Ảnh sổ đầu bài (<Text style={[styles.title, { color: 'red' }]}>*</Text>)</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { chooseFile() }}
            style={[styles.image, { marginRight: 12 }]}>
            <Text style={styles.iconPlus}>+</Text>
            <Text style={styles.titleButtonImage}>Image</Text>
          </TouchableOpacity>
          <ScrollView style={{ height: 100, width: widthDevice - 130 }} horizontal>
            {urlImage ? <View style={styles.image}>
              <Image source={{ uri: `${baseUrl}/${urlImage}` }} style={styles.image} />
              <TouchableOpacity onPress={() => hanldeDelImage()}
                style={styles.delImage}>
                <AntDesign
                  name={'closecircle'}
                  color={"white"}
                  size={24}
                />
              </TouchableOpacity>
            </View> :
              listImage?.uri &&
              <View style={styles.image}>
                <Image source={{ uri: listImage?.uri }} style={styles.image} />
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
        <Text style={styles.title}>Điểm sổ đầu bài (<Text style={[styles.title, { color: 'red' }]}>*</Text>)</Text>
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
        <Text style={styles.title}>Tổng số buổi vắng (<Text style={[styles.title, { color: 'red' }]}>*</Text>)</Text>
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

      <Header title={item?.id ? item?.status == "Created"? "Cập nhật thành tích": "Thông tin thành tích" : "Thêm thành tích"} />
      <ScrollView style={styles.mainContainer}>
        <View style={{ flex: 1, padding: 20, height: heightDevice - 175 }}>
          {_renderImage()}
          {_renderPoint()}
          {_renderAbsent()}
        </View>
        {((item?.id && item?.status == "Created") || !(item?.id)) ?
        <TouchableOpacity disabled={item?.id && item?.status != "Created" ? true : false}
          onPress={() => { item?.id ? onHanldeUpdateAchieve() : onHanldeSendAchieve() }}
          style={[mainStyle.buttonContainer, styles.buttonSend,]}>
          <FontAwesome
            name={'send-o'}
            color={"white"}
            size={24}
          />
          <Text style={[mainStyle.buttonTitle, { marginHorizontal: 12, fontSize: 18 }]}>{item?.id ? "Cập nhật phiếu thành tích" : "Gửi phiếu thành tích"}</Text>
        </TouchableOpacity> : null}
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
    marginBottom: 10, color: 'black'
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