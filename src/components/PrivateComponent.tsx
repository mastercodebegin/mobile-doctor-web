import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import Loading from './Loading'

const PrivateComponent = () => {
  const {loggedIn , checkStatus, role} = useAuthStatus()

  // Debug info
  console.log("PrivateComponent - loggedIn:", loggedIn, "role:", role);

  if(checkStatus){
    return <Loading />
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateComponent











