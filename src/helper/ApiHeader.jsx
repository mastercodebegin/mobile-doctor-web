// // import AsyncStorage from "@react-native-async-storage/async-storage"


// export const ApiHeader=async()=>{
// // const token = await AsyncStorage.getItem('jwtToken')
// const JwtToken = localStorage.getItem(token, JSON.stringify())


// return JwtToken?{
// 'jwtToken':JSON.parse(token),
// 'Content-Type': 'application/json'
// }:{}
// }

import {UrlConstants} from "../util/practice/UrlConstants"



export const ApiHeader = async () => {
  const token = localStorage.getItem("jwtToken");
// console.log(token)
  return token
    ? {
        jwtToken: JSON.parse(token),
        "Content-Type": "application/json",
      }
    :  {
        jwtToken: UrlConstants.TOKEN,
        "Content-Type": "application/json",
      };
};