import Axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import qs from 'qs'
import {ApiHeader} from "../helper/ApiHeader"
import { UrlConstants } from './practice/UrlConstants'
// import { ShowErrorModal } from '../ErrorModalWindow/ErrorModalWindow/ErrorModalWindowSlice'

// const shoErrorModalHandler=(error : any)=>{
//     // Store.dispatch(ShowErrorModal(error.response.data.message));
//     Store.dispatch(ShowErrorModal(error.response.data.message));

// }

export const getRequestMethod = async (requestUrl:any) => {
    const headers = await ApiHeader();

        // console.log("Final URL =>", UrlConstants.BASE_URL + requestUrl);
// console.log("Headers =>", headers);  

    try {
        const response = await Axios({
            method: 'get',
            headers:headers, 
            url: UrlConstants.BASE_URL + requestUrl,
        });


    //    console.log('response======',response.data);
        
        return response?.data;
    } catch (error) {
        // Axios error object contains response data in error.response
        if (error.response) {
            console.log('error--------------', error.response.data.message);

             console.log('Error response Data:', error.response.data);
             console.log('Error response:', error.response);
  throw new Error(error.response.data?.message || "Something went wrong");


            // const dispatch = useDispatch()
            //  dispatch(ShowErrorModal(error.response.data.message))
            // shoErrorModalHandler(error)
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }
    }
}

export const getRequestMethodWithParam = async (requestParam: any ,requestUrl:any) => {
const headers = await ApiHeader();
console.log("Params ja rahe hain kya:", requestParam);
   try {
    const response = await Axios({
        method: 'get',
        headers:headers,
        params:requestParam,
        url: UrlConstants.BASE_URL + requestUrl,
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
    });

    return response?.data;
} catch (error : any) {
    // Axios error object contains response data in error.response
    if (error.response) {
        console.log('errormsg--------------', error.response.data);
        console.log('errormsg 2--------------', error?.response);
        // const dispatch = useDispatch()
        //  dispatch(ShowErrorModal(error.response.data.message))
        shoErrorModalHandler(error)
        throw new Error(error.response.data.message); // Throwing error to trigger rejection
    } else {
        console.log('error--------------', error.message);
        throw new Error(error.response.data.message); // Throwing error to trigger rejection
    }
}
}

// Fixed postRequestMethod in CommonService.tsx

export const postRequestMethod = async (requestData : any, requestUrl : any,) => {
    const headers = await ApiHeader();
    
    try {
        const response = await Axios({
            method: 'post',
            data: requestData,
            url: UrlConstants.BASE_URL + requestUrl,
            headers:headers
        });
        
        return response?.data;
    } catch (error : any) {
        // Axios error object contains response data in error.response
        if (error.response) {
            shoErrorModalHandler(error)
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }
    }
};


export const postRequestMethodForAddVariant = async (requestData: any, requestUrl: any) => {
    console.log("📤 Sending POST request to:", UrlConstants.BASE_URL + requestUrl);
    
    // Get headers
    const headers = await ApiHeader();
    
    // Check if requestData is FormData (for file uploads)
    const isFormData = requestData instanceof FormData;
    
    if (isFormData) {
        console.log("📦 FormData detected - logging contents:");
        for (let [key, value] of requestData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File {name: ${value.name}, size: ${value.size}, type: ${value.type}}`);
            } else {
                console.log(`${key}:`, value);
            }
        }
        
        // For FormData, don't set Content-Type manually - let browser set it with boundary
        delete headers['Content-Type'];
    } else {
        console.log("📦 Regular data:", requestData);
        // For regular JSON data, ensure Content-Type is set
        headers['Content-Type'] = 'application/json';
    }
    
    try {
        const response = await Axios({
            method: 'post',
            data: requestData,
            url: UrlConstants.BASE_URL + requestUrl,
            headers: headers,
            timeout: 30000, // 30 second timeout
        });
        
        console.log("✅ POST request successful:", response?.data);
        return response?.data;
        
    } catch (error: any) {
        console.error("❌ POST request failed:", error);
        
        if (error.response) {
            // Server responded with error status
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
            
            shoErrorModalHandler(error);
            throw new Error(error.response.data?.message || 'Server error occurred');
            
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received:", error.request);
            throw new Error('No response received from server');
            
        } else {
            // Something happened in setting up the request
            console.error("Request setup error:", error.message);
            throw new Error(error.message || 'Request setup failed');
        }
    }
};


export const postRequestMethodWithParams = async (requestData:any, requestUrl:any) => {
    const headers = await ApiHeader();

    const  response = await Axios({
        method:'post',
        params:requestData,
        url:UrlConstants.BASE_URL+requestUrl,  
        headers:headers
        
    }).catch((error)=>
        {if (error.response) {
            console.log('error--------------', error.response.data.message);
            shoErrorModalHandler(error)
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }}
    );
    console.log('url-----------',UrlConstants.BASE_URL+requestUrl);
    
    return response?.data

}


export const postRequestMethodWithBodyAndParam = async (
    requestBody: any,
    requestUrl: string,
    pathParam: string
) => {
    console.log("Post method with path param-----", pathParam);
    console.log(requestBody, 'Post method with body');
    
    const headers = await ApiHeader();
    
    try {
        const response = await Axios({
            method: 'post',
            data: requestBody,
            url: `${UrlConstants.BASE_URL}${requestUrl}/${pathParam}`, // Path parameter in URL
            headers: headers,
        });
        
        console.log('Post Response:', response.data);
        return response.data;
        
    } catch (error: any) {
        if (error.response) {
            console.log('error--------------', error.response.data);
            console.log('error--------------', error.response.data.message);
            console.log('error--------------', error.response.status);
            shoErrorModalHandler(error);
            throw new Error(error.response.data.message);
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.message);
        }
    }
};



export const putRequestMethod = async (formData:any, requestUrl:any) => {
    const headers = await ApiHeader();
    // const token = await header()
    // console.log(token);
    console.log('put request');
    
    const  response = await Axios({
        method:'put',
        // data:requestData,
        data:formData,
        headers:headers,
        url:UrlConstants.BASE_URL+requestUrl,  
        
    }).catch((error)=>
        {if (error.response) {
            console.log('error--------------', error.response.data.message);
            // const dispatch = useDispatch()
            //  dispatch(ShowErrorModal(error.response.data.message))
            shoErrorModalHandler(error)
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }}
    );
    console.log('url-----------',UrlConstants.BASE_URL+requestUrl);
    
    return response?.data
    
}

export const putRequestMethodWithParam = async (requestData:any, requestUrl:any) => {
    console.log(requestData,"Put method")
    const headers = await ApiHeader();

    const  response = await Axios({
        method:'put',
        params:requestData,
        url:UrlConstants.BASE_URL+requestUrl,  
        headers:headers,
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        
    }).catch((error)=>
        {if (error.response) {
            console.log('error--------------', error.response);
            console.log('error--------------', error.response.data);
            console.log('error--------------', error.response.data.message);
            // const dispatch = useDispatch()
            //  dispatch(ShowErrorModal(error.response.data.message))
            shoErrorModalHandler(error)
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }}
    );
    return response?.data
    
}

export const putRequestMethodWithBodyAndParam = async ( requestBody : any, requestUrl : string, requestParam?: string ) => {
    console.log("Put method-----",requestParam)
        console.log(requestBody, "Put method with body");
    const headers = await ApiHeader();

        // Construct URL with path parameter if provided
    const fullUrl = requestParam ? 
        `${UrlConstants.BASE_URL}${requestUrl}${requestParam}` : 
        `${UrlConstants.BASE_URL}${requestUrl}`;

    const  response = await Axios({
        method:'put',
        url:fullUrl,  
        data:requestBody,
        headers:headers,
    }).catch((error)=>
        {if (error.response) {
           console.log('error--------------', error.response);
            console.log('error--------------', error.response.data);
            console.log('error--------------', error.response.data.message);
            shoErrorModalHandler(error)
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        } else {
            console.log('error--------------', error.message);
            throw new Error(error.response.data.message); // Throwing error to trigger rejection
        }})
    
    return response?.data
    
}

export const deleteRequestMethodWithParam = async (requestData: any, requestUrl: string) => {
    console.log('deleteRequestMethodWithParam url----', UrlConstants.BASE_URL + requestUrl);
    console.log('deleteRequestMethodWithParam data-----', requestData);
    
    const response = await Axios({
        method: 'delete',
        url: UrlConstants.BASE_URL + requestUrl,
        headers: {
            "jwtToken": UrlConstants.TOKEN,
        },
        params: requestData
    }).catch(error => {
        console.log('Delete error:', error);
        throw error;
    });
    
    return response;
}