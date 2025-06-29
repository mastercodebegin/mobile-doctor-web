import { useState, useEffect } from 'react';
import CreateUserModal from '../../components/CreateUserModal';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { RootState } from '../../redux/store';
import { User } from '../../types/User';
import { Remove } from './VendorSlice';
import { TableHadeClass } from '../../helper/ApplicationConstants';


const UserManagement = () => {

        const { data, isLoading } = useSelector((state: RootState) => state.VendorSlice);

const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const usersPerPage = 5; // You can set 10 or any number you want
const totalPages = Math.ceil(data.length / usersPerPage);
const paginatedUsers = data.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


  // Animation for table rows
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'text-green-600';
      case 'Inactive':
        return 'text-yellow-500';
      case 'Suspended':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusDot = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Inactive':
        return 'bg-yellow-500';
      case 'Suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditUser = (userId: number) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
dispatch(Remove(userId))
  };


  if(isLoading){
   return <Loading />
  }

  return (
    <>
      <div className="md:h-[calc(95vh-80px)] md:overflow-y-hidden overflow-x-hidden">
<div className="flex items-center justify-between">
  <h1 className="font-bold text-2xl" >User Management</h1>
  <button onClick={() => setShowModal(true)} className="bg-blue-300 hover:bg-blue-400 duration-200 px-10 py-3 rounded-md" >Create User</button>
</div>




    <div className="bg-gray-50 p-4 mt-2 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-white">
              <tr>
                <th scope="col" className={TableHadeClass}>
                  #
                </th>
                <th scope="col" className={TableHadeClass}>
                  Name
                </th>
                <th scope="col" className={TableHadeClass}>
                  Mobile Number
                </th>
                <th scope="col" className={TableHadeClass}>
                  Email
                </th>
                <th scope="col" className={TableHadeClass}>
                  Status
                </th>
                <th scope="col" className={TableHadeClass}>
                  View
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* {users.map((user, index) => ( */}
              {paginatedUsers.map((user : User, index) => (

                <tr 
                  key={user.id} 
                  className={`transform transition-all duration-300 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredRow(user.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={user.avatar} 
                          alt={user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-600">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {user.dateCreated}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusDot(user.status)} mr-2`}></div>
                      <span className={`text-sm ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-cyan-400 hover:text-cyan-600 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sm:flex-row flex-col">
          {/* <div className="text-sm text-gray-500">
            Showing 5 out of 25 entries
          </div> */}
          <div className="text-sm text-gray-500">
  Showing {paginatedUsers.length} out of {data.length} entries
</div>

          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={handlePrevious} 
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {/* {[1, 2, 3, 4, 5].map((page) => ( */}
           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (

              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 
                  ${currentPage === page 
                    ? 'bg-cyan-400 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={handleNext} 
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>


 {/* Modal */}
      <CreateUserModal isOpen={showModal} onClose={() => setShowModal(false)} />

     </div>
    </>
  )
}

export default UserManagement
