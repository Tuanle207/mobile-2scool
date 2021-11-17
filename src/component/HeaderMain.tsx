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
  const { renderLeft, renderCenter, title } = props
  const _renderLeft = () => (
    <TouchableOpacity>
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
        backgroundColor={color.blueStrong}
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        hidden={false} />
      <View style={styles.headerContainer}>
        {/* {renderLeft ? renderLeft : _renderLeft()} */}
        {renderCenter ? renderCenter : _renderCenter()}
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
    backgroundColor: color.blueStrong,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  iconBack: {
    tintColor: 'white',
    marginLeft: 15
  },
  titleCenter: {
    fontSize: fontSize.title,
    color: 'white',
    fontWeight: 'bold',
  }
})

export default StatusHeaderBar