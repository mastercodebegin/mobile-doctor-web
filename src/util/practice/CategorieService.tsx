// /* eslint-disable */
// import React from 'react';
// // import {commonService} from './CommonService';
// import {UrlConstants} from './UrlConstants';
// export const CategorieService = {
//   addCategorie,
//   updateCategorie,
//   deleteCategorie,
//   getAllCategorie
   
// };
// function addCategorie(data:any,token:any) {
//   console.log('deleteCategorie');
  
//   const url = UrlConstants.ADD_CATEGORIE;
//   const apiurl = commonService.postRequestMethod(url,data,token);
//   return apiurl;      
// }
// function updateCategorie(jwtToken:any) {
//   const url = UrlConstants.GET_MY_PROFILE;
//   const apiurl = commonService.getRequestMethod(jwtToken);
//   return apiurl;      
// }
// function deleteCategorie(data:any) {
//   const url = UrlConstants.FORGOT_PASSWORD + '/' + data.userName;
//   const apiurl = commonService.putRequestMethod(url,"");
//   return apiurl;      
// }
// function getAllCategorie() {
//   const requestedUrl = UrlConstants.GET_ALL_CATEGORIE
//   const apiurl = commonService.getRequestMethod(requestedUrl);
//   return apiurl;      
// }
import { Text, View } from 'react-native'
import React, { Component } from 'react'

export default class CategorieService extends Component {
  render() {
    return (
      <View>
        <Text>CategorieService</Text>
      </View>
    )
  }
}
