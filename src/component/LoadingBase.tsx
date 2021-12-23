import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';

interface Props {
    visible?:boolean,
    renderIndicator?:any,
    indicatorColor?:string,
    indicatorSize?:number,
    backgroundColor?:string,
    containerStyle?:any,
  }
  
const LoadingBase = (props:Props ) => {
  const {
    visible,
    renderIndicator,
    indicatorColor,
    indicatorSize,
    backgroundColor,
    containerStyle,
  } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(visible);
  }, [visible]);
  return (
    <>
      <Modal    presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        visible={isLoading}
        animationType="fade"
        transparent>
        <View
          style={[
            styles.container,
            {backgroundColor: 'rgba(0, 0, 0, 0.1)'},
            containerStyle,
          ]}>
          {renderIndicator ? (
            renderIndicator()
          ) : (
            <ActivityIndicator size={indicatorSize} color={indicatorColor} />
          )}
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
LoadingBase.defaultProps = {
  visible: false,
  indicatorColor:'blue',
  indicatorSize: 'large',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
};

export default LoadingBase;
