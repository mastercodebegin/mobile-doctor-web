import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { AddsupportTicket, GetAllSupportTicket, GetAllSupportTicketByTicketNumber, Update, UpdateSupportTicket } from "./SupportTicketSlice";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";

const SupportTicket = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchByTicket, setSearchByTicket] = useState(false);
  const [filterNumber, setFilterNumber] = useState<any>('')
  // --- ADD-MODE STATES ---
  const [ticketNumber, setTicketNumber] = useState("");
  const [userIssue, setUserIssue] = useState("");
  const [supportTicketStatus, setSupportTicketStatus] = useState("PENDING");
  const [cssescription, setCssescription] = useState("");
  const [seniorCSDescription, setSeniorCSDescription] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { SupportTicketData, isLoading, Edit } = useSelector((state: RootState) => state.SupportTicketSlice)

  const usersPerPage = 5;
  const paginatedUsers = SupportTicketData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  const handleClearFilter = () => {
    setFilterNumber("");               
  setCurrentPage(1);                 
  dispatch(GetAllSupportTicket());
   }

  const handleSearchIconClick = () => {
    setShowModal(true);
    setSearchByTicket(true);
  };

  const handleSaveClick = () => {
  if (searchByTicket) {
    // =================  SEARCH  =================
    if (!filterNumber.trim()) return;
    dispatch(GetAllSupportTicketByTicketNumber(filterNumber.trim()));
    handleCloseModal();
    return;
  }

  if (!ticketNumber.trim() || !userIssue.trim()) {
    toast.warn("Ticket Number and User Issue are required");
    return;
  }

  if (isEditMode && Edit.supportTicket?.id) {
    // =================  UPDATE  =================
    const payload = {
      ...Edit.supportTicket,
      ticketNumber: ticketNumber,
      userIssue: userIssue, 
      supportTicketStatus: supportTicketStatus,
      cssescription: cssescription,
      seniorCSDescription: seniorCSDescription,
    };

    dispatch(Update(payload))

    dispatch(UpdateSupportTicket({
      id: Edit.supportTicket.id,
      updateData: payload
    }))   
      .unwrap()
      .then((res: any) => {
        toast.success(res.message || "Ticket Updated successfully!");
        handleCloseModal();
        dispatch(GetAllSupportTicket());     
      })
      .catch((err: any) => toast.error("Update failed: " + err));
  } else {
    // =================  CREATE  =================
    setShowConfirmModal(true);             
  }
};

  const handleConfirmSave = () => {
    const payload = {
      ticketNumber,
      userIssue,
      supportTicketStatus,
      cssescription,
      seniorCSDescription,
    };

    dispatch(AddsupportTicket(payload))
      .unwrap()
      .then((res: any) => {
        toast.success(res.message || "Ticket created successfully!");
        setShowModal(false);
        setShowConfirmModal(false);
        handleCloseModal()
        dispatch(GetAllSupportTicket()); 
      })
      .catch((err: any) => {
        toast.error("Creation failed: " + err);
        setShowConfirmModal(false);      
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchByTicket(false);
    setFilterNumber("");
  }

const handleEditUser = (ticket: any) => {
  dispatch(Update(ticket))
  setShowModal(true);
  setIsEditMode(true);

  // pre-fill the form
  setTicketNumber(ticket.ticketNumber);
  setUserIssue(ticket.userIssue);
  setSupportTicketStatus(ticket.supportTicketStatus);
  setCssescription(ticket.cssescription || "");
  setSeniorCSDescription(ticket.seniorCSDescription || "");

};

  const handleDeleteUser = (userId: number) => {
    console.log("Delete User with ID: --", userId)
  }

  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllSupportTicket())
  }, [])

  // Sync data to localStorage whenever Support-Ticket changes
  useEffect(() => {
    if (SupportTicketData.length > 0) {
      localStorage.setItem('orders', JSON.stringify(SupportTicketData));
    }
  }, [SupportTicketData])

  useEffect(() => {
if(Edit?.isEdit && Edit?.supportTicket) {
  setIsEditMode(true);
  setUserIssue(Edit?.supportTicket?.userIssue);
  setCssescription(Edit?.supportTicket?.cssescription);
  setTicketNumber(Edit?.supportTicket?.ticketNumber);
  setSeniorCSDescription(Edit?.supportTicket?.seniorCSDescription);
  setSupportTicketStatus(Edit?.supportTicket?.supportTicketStatus);
} else {
  setIsEditMode(false);
  setUserIssue("");
  setCssescription("");
  setTicketNumber("");
  setSeniorCSDescription("");
  setSupportTicketStatus(null);

}
  },[Edit])

  if (isLoading) {
    return <Loading />
  }


  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden" >

        <div className="mt-10 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"}
              onClick={handleSearchIconClick}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
                />
              </svg>
            </button>

              <button
    onClick={handleClearFilter}
    className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-500 hover:bg-red-600 hover:text-white rounded-md transition-all"
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-white">
                  <tr>
                    <th className={TableHadeClass}>ID</th>
                    <th className={TableHadeClass}>Ticket Number</th>
                    <th className={TableHadeClass}>User Issue</th>
                    <th className={TableHadeClass}>Status</th>
                    <th className={TableHadeClass}>Created By</th>
                    <th className={TableHadeClass}>CS Description</th>
                    <th className={TableHadeClass}>Senior CS Desc</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                    <th scope="col" className={TableHadeClass}>Delete</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers?.length > 0 ? (
                    paginatedUsers.map((ticket, index) => (
                    <tr
                          className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            } ${hoveredRow === ticket.id ? 'bg-gray-50' : 'bg-white'}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                          onMouseEnter={() => setHoveredRow(ticket.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                        <td className={TableDataClass}>{ticket.id}</td>
                        <td className={TableDataClass}>{ticket.ticketNumber}</td>
                        <td className={TableDataClass}>{ticket.userIssue}</td>
                        <td className={TableDataClass}>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${ticket.supportTicketStatus === 'PENDING' ? 'bg-blue-100 text-blue-800'
                                : ticket.supportTicketStatus === 'INREVIEW' ? 'bg-yellow-100 text-yellow-800'
                                : ticket.supportTicketStatus === 'REOPEN' ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'}
                    `}
                          >
                            {ticket.supportTicketStatus}
                          </span>
                        </td>
                        <td className={TableDataClass}>
                          {ticket.createdBy
                            ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}`
                            : '--'}
                        </td>
                        <td className={TableDataClass}>{ticket.cssescription || '--'}</td>
                        <td className={TableDataClass}>{ticket.seniorCSDescription || '--'}</td>
                        <td className={TableDataClass}>
                          <button onClick={() => handleEditUser(ticket)} className={EditClass}>
                            {EditIcon}
                          </button>
                        </td>
                        <td className={TableDataClass}>
                          <button onClick={() => handleDeleteUser(ticket.id)} className={DeleteClass}>
                            {DeleteIcon}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-gray-500">
                        No support tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalCount={SupportTicketData.length}
              itemsPerPage={usersPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </div>

      {/* Add/Edit Support-Ticket */}
      {showModal && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-[90%] relative">
              <h2 className="text-3xl font-semibold text-center mb-6">
                {searchByTicket ? "Search By Token-Number" : isEditMode ? "Edit Support Ticket" : "Add Support Ticket"}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              {searchByTicket ? (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Ticket Number</label>
                  <input
                    type="text"
                    value={filterNumber}
                    onChange={(e) => setFilterNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Enter Token Number"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label>Ticket Number</label>
                    <input
                    required
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label>User Issue</label>
                    <input
                    required
                      value={userIssue}
                      onChange={(e) => setUserIssue(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label>Status</label>
                    <select
                    required
                      value={supportTicketStatus}
                      onChange={(e) => setSupportTicketStatus(e.target.value)}
                      className={inputClass}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REOPEN">REOPEN</option>
                      <option value="RESOLVED">INREVIEW</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                  <div>
                    <label>CS Description</label>
                    <textarea
                      rows={2}
                      required
                      value={cssescription}
                      onChange={(e) => setCssescription(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label>Senior CS Description</label>
                    <textarea
                      rows={2}
                      required
                      value={seniorCSDescription}
                      onChange={(e) => setSeniorCSDescription(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleCloseModal}
                  className={ShowModelCloseButtonClass}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className={SubmitButtonClass}
                >
                  {searchByTicket ? "Search" : (isEditMode ? "Update" : "Add")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal for Add */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          message="Are you sure you want to add this Support Ticket?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

    </>
  )
}

export default SupportTicket
