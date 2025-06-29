import React, { useReducer } from "react";
// import { View, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";
// import { scaledSize } from '../../helper/util/Utilities';
// import { COLORS, Fonts } from "../../utilits/GlobalAssets";
// import { Button } from "react-native-paper";
// import CustomeButton from "../../helper/util/CustomeButton";
import { useDispatch, useSelector } from "react-redux";
// import { HideErrorModal, ShowErrorModal } from "./ErrorModalWindowSlice";
// import Icon from 'react-native-vector-icons/MaterialIcons'
// import CustomCloseIcon from "../../component/CustomCloseIcon";
// import CustomVectorIcon from "../../component/CustomVectorIcon";
// import { Overlay } from "react-native-elements";
// import { ScrollView } from "react-native-gesture-handler";
// import { Image } from "react-native";
// import { close_icon_for_modal } from "../../utilits/GlobalImages";

interface S {
  onPressClose: () => any
  isVisible: boolean

}
const ErrorModalWindow = () => {
  const dispatch = useDispatch()
  // const { isErrorModalWindow, message } = useSelector((state: any) => state.ErrorModalWindowSlice);

  return (
    <div>
          {/* <Overlay isVisible={isErrorModalWindow}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} animationType='fade'>
            <View style={{
                width: scaledSize(250),
                height: scaledSize(280),
            }}>
                <View style={{
                    height: scaledSize(120),
                    flexDirection: 'row',
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={close_icon_for_modal}  resizeMode='center'
                             style={{tintColor:'#f15b55',height:scaledSize(110),width:scaledSize(110)}} />
                    </View>
                    
                </View>

                <View style={{ height: scaledSize(110), justifyContent: 'center', alignItems: 'center',
                    borderBottomWidth:1,borderColor:'#d3d3d3' }}>
                    <Text style={{ fontSize: scaledSize(14), fontFamily: Fonts.Primary_Text, letterSpacing: 1 }}>{message}</Text>
                </View>
                <View style={{ height: scaledSize(50),
                    justifyContent: 'center', alignItems: 'center', }}>
                        <CustomeButton style={{backgroundColor:'white'}} name='Close' textStyle={{fontFamily:Fonts.Primary_Text,color:'black'}} 
                        onPress={() => dispatch(HideErrorModal(false))}/>
                </View>

            </View>

        </Overlay> */}
    </div>
  );
};

export default ErrorModalWindow;


