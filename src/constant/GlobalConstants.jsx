// Swager API
// http://104.154.111.15:8080/doctor/swagger-ui/index.html?configUrl=/doctor/v3/api-docs/swagger-config


// export const UrlConstants = {
//   //  BASE_URL:'https://reqres.in/api/users?page=2/',
//   // BASE_URL: 'http://52.201.90.251:8082/api/',
//   // BASE_URL: 'http://52.201.90.251:8082/api/',
//   // BASE_URL:'http://10.0.0.85:9090/',
//   BASE_URL:' http://104.154.111.15:8080/doctor/',
//   // BASE_URL: 'http://api.famawork.com:8082/api/',
//   //Admin Token
//   TOKEN:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYXBwbGljYXRpb25hZG1pbiIsImlzcyI6InNob3BleCIsImV4cCI6MTc0MzU5ODI1MywiaWF0IjoxNzEyMDYyMjUzLCJ1c2VySWQiOjExLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwianRpIjoiNzZmOTQ3NGUtM2M0Mi00YjMyLWI4Y2ItNjRmNmI2OTJlYzI5In0.5cf1OeyxNxR8da-lyKklQLnsrcI-0y8H6MI7tiMx-3g',

//   // Vendor Token
//   // TOKEN:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVmVuZG9yIiwiaXNzIjoic2hvcGV4IiwiZXhwIjoxNzA5MjAyNDg3LCJpYXQiOjE2Nzc2NjY0ODcsInVzZXJJZCI6MywiZW1haWwiOiJ2ZW5kb3JAeW9wbWFpbC5jb20iLCJqdGkiOiI4ODdlNGE2Yy1lMmJiLTQ4OGItYjkxZC1jZGM2OTJmNTNlOTMifQ.Q1ERjn52Mzrjo-VubRjEI9rPIAhu9r5qJef3HGRXs2c",
//   AWS_IMAGE_BASE_URL:'https://userdocumentx.s3.ap-northeast-1.amazonaws.com/',
//   LOGIN: 'user/login',
//   // LOGIN: 'vendor/login',
//   CREATE_VENDOR:'vendor/createVendor',
//   UPDATE_VENDOR_STATUS:'vendor/updateVendorAccountStatus',
//   GET_ALL_VENDOR:'vendor/getAllVendor',
//   GET_PROFILE:'User/getMyProfile',
//   ADD_BRAND:'brand/addBrand',
//   GET_ALL_BRAND:'brand/getAllBrand',
//   ADD_CATEGORY:'category/addCategory',
//   GET_ALL_CATEGORY:'category/getAllCategory',
//   ADD_SUB_CATEGORY:'subCategory/addSubCategory',
//   GET_ALL_SUB_CATEGORY_BY_ID:'subCategory/getallSubCategoriesByCategoryPK/',
//   GET_ALL_SUB_CATEGORY:'subCategory/getallSubCategories',
//   ADD_MODAL_NUMBER:'ProductModalNumber/addModalNumber',
//   GET_ALL_MODAL_NUMBER:'ProductModalNumber/getAllModalNumber',
//   GET_ALL_MODAL_NUMBER_BY_ID:'ProductModalNumber/getAllModalNumberByBrandPK/',
//   UPLOAD_SINGLE_IMAGE:'filUpload/profilePicture',
//   UPLOAD_MODAL_IMAGES:'filUpload/uploadModalImages',
//   ADD_VARIANT:'variant/addVariant',
//   GET_ALL_VARIANT:'variant/getAllVariant',
//   GET_ALL_VARIANT_BY_MODAL_NUMBER_ID:'variant/getAllVariantByModalNumberId/',
//   ADD_PRODUCT:'product/addProduct',
//   GET_ALL_VENDOR_PRODUCT_BY_VENDOR_ID:'vendorProduct/getAllVendorProductByVendorId',
//   GET_ALL_VENDOR_PRODUCT:'product/getAllVendorProduct',
//   GET_ALL_PRODUCT:'product/getAllVendorProduct',
//   ADD_VENDOR_PRODUCT:'vendorProduct/addVendorProduct',
//   UPDATE_VENDOR_PRODUCT:'/vendorProduct/updateStock/',
//   ADD_COLOR:'color/addColor',
//   GET_ALL_COLOR:'color/getAllColor',
//   ADD_VARIANT_COLOR:'/modalColor/create',
//   GET_ALL_VARIANT_COLOR:'/modalColor/getAllColor',
// }



export const AccountStatusConstants = {
  APPROVED:'APPROVED',
  REJECTED:'REJECTED',
  DOCUMENT_SUBMITTED:'DOCUMENT_SUBMITTED',
  DOCUMENT_REQUIRED:'DOCUMENT_REQUIRED',
}
  
export const RolesId = {
  APPLICATION_ADMIN:1,
  CUSTOMER_CARE:2,
  SALES_EXECUTIVE:3,
  PRODUCT_EXECUTIVE:4,
  VENDOR:5

}

export  const statesData=[{id:'1',name:"MadhyaPradesh"},
                          {id:'2',name:"Maharashtra"},
                          {id:'3',name:"Gujarat"}]

export const indoreCity=[{id:'1',name:'Indore'},
                         {id:'2',name:'Dewas'},
                         {id:'3',name:'Ujjain'}]

// export const idType = {AADHAR_CARD:'AADHAR CARD',VOTER_ID:'VOTER ID',PASSPORT:'PASSPORT',
//                         GUMASTA:'GUMASTA',PANCARD:'PANCARD',GST:'GST',DRIVING_LICENSE:'DRIVING LICENSE'}

export const personalIdTypes = [{id:'1',name:'AADHAR_CARD'},{id:'2',name:'VOTER_ID'},{id:'3',name:'DRIVING LICENSE'}]

export const businessIdTypes = { GST:'GST' , GUMASTA:'GUMASTA'}
