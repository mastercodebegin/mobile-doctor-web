// /* eslint-disable */
// import React from 'react';
// import {commonService} from './CommonService';
// import {UrlConstants} from './UrlConstants';
// export const LoginService = {
//     login,
//     getMyProfileApi,
//     forgotPasswordApi,
//     testAPI
// };
// function login(data:any) {
//   console.log('LoginService');
  
//   const url = UrlConstants.LOGIN;
//   const apiurl = commonService.putRequestMethod(url,data);
//   return apiurl;      
// }
// function getMyProfileApi() {
//   const url = UrlConstants.GET_MY_PROFILE;
//   const apiurl = commonService.getRequestMethod(url);
//   return apiurl;      
// }
// function forgotPasswordApi(data:any) {
//   const url = UrlConstants.FORGOT_PASSWORD + '/' + data.userName;
//   const apiurl = commonService.putRequestMethod(url,"");
//   return apiurl;      
// }

// function testAPI(data:any) {
//   console.log('testAPI');
  
//   const url = UrlConstants.TEST_API;
//   const apiurl = commonService.getRequestMethod(url,);
//   return apiurl;      
// }
import { Text, View } from 'react-native'
import React, { Component } from 'react'

export default class Loginservice extends Component {
  render() {
    return (
      <View>
        <Text>Loginservice</Text>
      </View>
    )
  }
}