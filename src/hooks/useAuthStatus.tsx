import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const useAuthStatus = () => {
    const {data} = useSelector((state : RootState) => state.UserLoginSlice)

    const [loggedIn , setLoggedIn] = useState<boolean>(false)
    const [checkStatus , setCheckStatus] = useState<boolean>(true)

      useEffect(() => {
const isLoggedIn = data && data.jwtToken || localStorage.getItem("token");
setLoggedIn(!!isLoggedIn);
    setCheckStatus(false);
  }, [data]);

    return {loggedIn , checkStatus}

}

export default useAuthStatus
