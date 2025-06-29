import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import Loading from './Loading'

const PrivateComponent = () => {
  const {loggedIn , checkStatus} = useAuthStatus()

  if(checkStatus){
    return <Loading />
  }

  return loggedIn ? <Outlet /> : <Navigate to={"/login"} />

}

export default PrivateComponent
