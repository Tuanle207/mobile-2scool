import { useNavigation } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'

interface Props {
  renderLeft?: () => ReactElement
  renderCenter?: () => ReactElement
  renderRight?: () => ReactElement
  title: string
}

const StatusHeaderBar = (props: Props) => {
  const { renderLeft, renderCenter, renderRight, title } = props
  const navigation = useNavigation()
  const _renderLeft = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={require('../assets/icon/back.png')} style={styles.iconBack} />
    </TouchableOpacity>
  )
  const _renderCenter = () => (
    <Text style={styles.titleCenter}>{title}</Text>
  )

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor='white'
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        hidden={false} />
      <View style={styles.headerContainer}>
        {_renderLeft()}
        {renderCenter ? renderCenter : _renderCenter()}
        {renderRight ? renderRight : <View style={{marginRight: 15}}></View>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  headerContainer: {
    height: 36,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10
  },
  iconBack: {
    tintColor: color.blueStrong,
    marginHorizontal: 20
  },
  titleCenter: {
    flex: 1,
    fontSize: fontSize.title,
    color: color.blueStrong,
    fontWeight: 'bold',
  }
})

export default StatusHeaderBar