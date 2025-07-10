// // import AsyncStorage from "@react-native-async-storage/async-storage"


// export const ApiHeader=async()=>{
// // const token = await AsyncStorage.getItem('jwtToken')
// const JwtToken = localStorage.getItem(token, JSON.stringify())


// return JwtToken?{
// 'jwtToken':JSON.parse(token),
// 'Content-Type': 'application/json'
// }:{}
// }






export const ApiHeader = async () => {
  const token = localStorage.getItem("authToken");

  return token
    ? {
        jwtToken: token,
        'Content-Type': 'application/json'
      }
    : {
        'Content-Type': 'application/json'
      };
};
