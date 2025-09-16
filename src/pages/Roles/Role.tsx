import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import ConfirmationModal from "../../components/ConfirmationModal";
import { ClearFilter, EditClass, EditIcon, inputClass, SearchIcon, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { toast } from "react-toastify";
import { CreateRole, GetAllRoles, GetRoleById, restore, Update, UpdtaeRole } from './RoleSlice';

const Role = () => {

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false)
    const [category, setCategory] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchByTicket, setSearchByTicket] = useState(false);
    const [filterNumber, setFilterNumber] = useState<any>('')

    const dispatch = useDispatch<AppDispatch>()

    const { roleData, isLoading, Edit } = useSelector((state: RootState) => state.RoleSlice)

    const usersPerPage = 5;
    const roleArray = Array.isArray(roleData) ? roleData : roleData ? [roleData] : [];
    const paginatedUsers = roleArray.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


    const handleClearFilter = () => {
        setFilterNumber("");
        setCurrentPage(1);
        dispatch(GetAllRoles());
    }

    const handleSearchIconClick = () => {
        setShowModal(true);
        setSearchByTicket(true);
    };

    const handleSaveClick = () => {
        if (searchByTicket) {
            // =================  SEARCH  =================
            if (!filterNumber.trim()) return;
            dispatch(GetRoleById(filterNumber.trim()));
            handleCloseModal();
            return;
        }

        if (!category.trim()) {
            alert("Please enter a Role name.");
            return;
        }

        if (isEditMode && Edit.role?.id) {
            try {

                dispatch(Update({ ...Edit.role, name: category }));

                dispatch(UpdtaeRole(Edit.role.id))
                    .unwrap()
                    .then((res: any) => {
                        console.log("Update response:", res);
                        dispatch(GetAllRoles());

                        toast.success(res.message || "Role updated successfully!");
                        handleCloseModal()
                    })
                    .catch((err: any) => {
                        console.error("Update failed:", err);
                        toast.error("Role update failed: " + err);
                    })
            } catch (error) {
                toast.error("Failed to update Role");
                console.error("Update error:", error);
            };

        } else {
            setShowConfirmModal(true);
        }

    }

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false)
        setCategory("")
    }

    const handleConfirmSave = () => {
        const newCategory = {
            name: category,
        }

        dispatch(CreateRole(newCategory))
            .unwrap()
            .then((res: any) => {
                dispatch(GetAllRoles())
                setCategory("");
                setShowModal(false);
                setShowConfirmModal(false);
                toast.success(res.message || "Brand Added Successfully!!")
                dispatch(restore(null))
            })
            .catch((err: any) => {
                toast.error("Brand Creation Failed: " + err)
                console.log("Brand Creation Failed :" + err)
            })
    };

    const handleEditUser = (user: User) => {
        console.log(`Edit user with ID: ${user}`);
        dispatch(Update(user))
        setShowModal(true)
        setCategory(user.name)
    };


    // Animation for table rows
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        dispatch(GetAllRoles())
    }, [])

    useEffect(() => {
        if (Edit.isEdit && Edit.role) {
            setIsEditMode(true);
            setCategory(Edit?.role?.name || "")
            setShowModal(true)
        } else {
            setIsEditMode(false);
            setCategory("")
        }
    }, [Edit]);

    {isLoading && <Loading overlay={true} />}


    return (
        <>

            <div className="md:overflow-y-hidden overflow-x-hidden">
                <div className="mt-10 flex items-center justify-between">

{/* Left Section */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"}
                            onClick={handleSearchIconClick}
                        >
                            {SearchIcon}
                        </button>

                        <button
                            onClick={handleClearFilter}
                            className={ClearFilter}
                        >
                            Clear Filter
                        </button>

                    </div>

                    {/* Add Button */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowModal(true)} className={SubmitButtonClass}>Add</button>
                    </div>
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
                                            ID
                                        </th>
                                        <th scope="col" className={TableHadeClass}>
                                            Name
                                        </th>
                                        <th scope="col" className={TableHadeClass}>
                                            Edit
                                        </th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedUsers?.map((user, index) => (

                                        <tr
                                            key={user?.id || `${user.name}-${index}`}
                                            className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                                } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                            onMouseEnter={() => setHoveredRow(user.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <td className={TableDataClass}>
                                                {user.id}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-600">{user.name}</div>
                                            </td>
                                            <td className={TableDataClass}>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className={EditClass}
                                                >
                                                    {EditIcon}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Reusable Pagination Component */}
                        <Pagination
                            currentPage={currentPage}
                            totalCount={roleData.length}
                            itemsPerPage={usersPerPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />

                    </div>
                </div>


            </div>

            {showModal && (
                <>
                    <div className={ShowModalMainClass}>
                        <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
                            <h2 className="text-3xl font-semibold text-center mb-6">Add Role</h2>

                            {/* Close Icon */}
                            <button
                                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>

                            {searchByTicket ? (
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Role Id</label>
                                    <input
                                        type="text"
                                        value={filterNumber}
                                        onChange={(e) => setFilterNumber(e.target.value)}
                                        className={inputClass}
                                        placeholder="Enter Role Number Id"
                                    />
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Role Name</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Add Role"
                                        className={inputClass}
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4 mt-8">
                                <button
                                    onClick={handleCloseModal}
                                    className={ShowModelCloseButtonClass}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    className={SubmitButtonClass}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'Continue')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <ConfirmationModal
                        isOpen={showConfirmModal}
                        title="Confirm Brand Creation"
                        message={`Are you sure you want to add the Role "${category}"?`}
                        onConfirm={handleConfirmSave}
                        onCancel={() => setShowConfirmModal(false)}
                    />
                </>

            )}

    {isLoading && <Loading overlay={true} />}
    
        </>
    )
}

export default Role
