const UrlConstants = {
  //  BASE_URL:'https://reqres.in/api/users?page=2',
  // BASE_URL:'http://104.154.111.15:8080/doctor/', // Old IP
  BASE_URL:'http://34.131.155.169:8080/doctor/', // Old IP
  LOGIN: 'user/login',
    //Admin Token
  TOKEN:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4iLCJpc3MiOiJzaG9wZXgiLCJleHAiOjE3ODE3MjgwNTIsImlhdCI6MTc1MDE5MjA1MiwidXNlcklkIjoxLCJlbWFpbCI6IkFkbWluQHRlc3QuY29tIiwianRpIjoiZTUwYmI0MTEtMjUwNy00YTZiLWE1OWYtNTEzNTQzNTgzZWJkIn0.zM5o41wgayv6iVyoOh0LAoOHbjpisvMyjZDvizgEDGE',
  // ADD_CATEGORIE:'category/add',
  // UPDATE_CATEGORIE:'category/update',
  // DELETE_CATEGORIE:'category/delete',
  // GET_ALL_CATEGORIE:'category/getall',
  TEST_API:'user/testapi',
  GET_MY_PROFILE:'user/getMyProfile',
  FORGOT_PASSWORD:'',
  ADD_CATEGORY:'category/addCategory',
  GET_ALL_CATEGORY:'category/getAllCategory',
  GET_ALL_BRAND:'brand/getAllBrand',
  GET_ALL_SUB_CATEGORY:'subCategory/getallSubCategories',
  DELETE_CATEGORIE:'category/deleteCategory/',
  UPDATE_CATEGORIE:'category/updateCategory/',
  UPDATE_SUB_CATEGORIE:'subCategory/updateSubCategory/',
  UPDATE_BRAND: 'brand/updateBrand/',
  UPDATE_MODAL_NUMBER: 'ProductModalNumber/updateModelNumber/',
  UPDATE_COLOR: 'color/updateColorName/',
  UPDATE_VARIANT: 'variant/updateVariant',
  DELETE_VARIANT: 'variant/deleteVariantById',



  //  BASE_URL:'https://reqres.in/api/users?page=2/',
  // BASE_URL: 'http://52.201.90.251:8082/api/',
  // BASE_URL: 'http://52.201.90.251:8082/api/',
  // BASE_URL:'http://10.0.0.85:9090/',
  // BASE_URL: 'http://api.famawork.com:8082/api/',


  // Vendor Token
  // TOKEN:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVmVuZG9yIiwiaXNzIjoic2hvcGV4IiwiZXhwIjoxNzA5MjAyNDg3LCJpYXQiOjE2Nzc2NjY0ODcsInVzZXJJZCI6MywiZW1haWwiOiJ2ZW5kb3JAeW9wbWFpbC5jb20iLCJqdGkiOiI4ODdlNGE2Yy1lMmJiLTQ4OGItYjkxZC1jZGM2OTJmNTNlOTMifQ.Q1ERjn52Mzrjo-VubRjEI9rPIAhu9r5qJef3HGRXs2c",
  AWS_IMAGE_BASE_URL:'https://userdocumentx.s3.ap-northeast-1.amazonaws.com/',
  // LOGIN: 'vendor/login',
  CREATE_VENDOR:'vendor/createVendor',
  UPDATE_VENDOR_STATUS:'vendor/updateVendorAccountStatus',
  GET_ALL_VENDOR:'vendor/getAllVendor',
  GET_PROFILE:'User/getMyProfile',
  ADD_BRAND:'brand/addBrand',
  ADD_SUB_CATEGORY:'subCategory/addSubCategory',
  GET_ALL_SUB_CATEGORY_BY_ID:'subCategory/getallSubCategoriesByCategoryPK/',
  ADD_MODAL_NUMBER:'ProductModalNumber/addModalNumber',
  GET_ALL_MODAL_NUMBER:'ProductModalNumber/getAllModalNumber',
  GET_ALL_MODAL_NUMBER_BY_ID:'ProductModalNumber/getAllModalNumberByBrandPK/',
  UPLOAD_SINGLE_IMAGE:'filUpload/profilePicture',
  UPLOAD_MODAL_IMAGES:'filUpload/uploadModalImages',
  ADD_VARIANT:'variant/addVariant',
  GET_ALL_VARIANT:'variant/getAllVariant',
  GET_ALL_VARIANT_BY_MODAL_NUMBER_ID:'variant/getAllVariantByModalNumberId/',
  ADD_PRODUCT:'product/addProduct',
  GET_ALL_VENDOR_PRODUCT_BY_VENDOR_ID:'vendorProduct/getAllVendorProductByVendorId',
  GET_ALL_VENDOR_PRODUCT:'product/getAllVendorProduct',
  GET_ALL_PRODUCT:'product/getAllVendorProduct',
  ADD_VENDOR_PRODUCT:'vendorProduct/addVendorProduct',
  UPDATE_VENDOR_PRODUCT:'/vendorProduct/updateStock/',
  ADD_COLOR:'color/addColor',
  GET_ALL_COLOR:'color/getAllColor',
  ADD_VARIANT_COLOR:'/modalColor/create',
  GET_ALL_VARIANT_COLOR:'/modalColor/getAllColor',


}

export {UrlConstants}