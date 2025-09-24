import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, YAxis } from 'recharts';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { GetAllOrderCount, GetAllOrdersInGraph } from './DashboardSlice';
import moment from 'moment';
import { Users, Package, Clock, ClipboardCheck, XCircle, CheckCircle2, Truck, UserCheck, Settings, Send, PackageCheck, Check, ArrowUp, ArrowDown } from "lucide-react";
import { EditClass } from '../../helper/ApplicationConstants';

const Dashboard = () => { 

  const {dashboardData, isLoading, productVisitData} = useSelector((state: RootState) => state.DashbaordSlice)
  const dispatch = useDispatch<AppDispatch>()
  const [showAllCards, setShowAllCards] = useState(false)

  console.log(dashboardData, productVisitData)

  // State for ResponseDetails
const [total, setTotal] = useState<number>(0);
const [readyToPick, setReadyToPick] = useState<number>(0);
const [pending, setPending] = useState<number>(0);
const [cancelled, setCancelled] = useState<number>(0);
const [completed, setCompleted] = useState<number>(0);
const [pickedUpByPartner, setPickedUpByPartner] = useState<number>(0);
const [pickedUpByUser, setPickedUpByUser] = useState<number>(0);
const [inService, setInService] = useState<number>(0);
const [readyToDispatch, setReadyToDispatch] = useState<number>(0);
const [dispatched, setDispatched] = useState<number>(0);
const [delivered, setDelivered] = useState<number>(0);


  
  // dropdown state
  const [selectedPeriod, setSelectedPeriod] = useState("WEEKLY");

   // Function -> jab user dropdown select karega
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    dispatch(GetAllOrdersInGraph(period));  // yaha period jaayega thunk me
  };

  const formatDate = (period, type) => {
  if (type === 'yearly' && period === null) {
    return 'No Data';
  }

  if (type === 'monthly') {
    return moment(period, 'YYYYMM').format('MMM YYYY');
  }

  if (type === 'weekly') {
    return moment(period, 'YYYYWW').format('w');
  }

  if (type === 'daily') {
    return moment(period).format('YYYY-MM-DD');
  }

  return period;
};


// Animate counting up effect with API data
useEffect(() => {
  if (!dashboardData?.responseDetails) return;

  const animationDuration = 1500;
  const frameDuration = 16;
  const frames = animationDuration / frameDuration;

  // Safe destructuring with default values
  const ordersCounts = dashboardData?.responseDetails?.ordersCounts || {};
  const {
    total = 0,
    CANCELLED = 0,
    COMPLETED = 0,
    PENDING = 0,
    READY_TO_PICK = 0,
    PICKED_UP_BY_PARTNER = 0,
    PICKED_UP_BY_USER = 0,
    IN_SERVICE = 0,
    READY_TO_DISPATCH = 0,
    DISPATCHED = 0,
    DELIVERED = 0,
  } = ordersCounts;

  // Increments per frame
  const totalInc = Math.ceil(total / frames) || 0;
  const readyToPickInc = Math.ceil(READY_TO_PICK / frames) || 0;
  const pendingInc = Math.ceil(PENDING / frames) || 0;
  const cancelledInc = Math.ceil(CANCELLED / frames) || 0;
  const completedInc = Math.ceil(COMPLETED / frames) || 0;
  const pickedUpByPartnerInc = Math.ceil(PICKED_UP_BY_PARTNER / frames) || 0;
  const pickedUpByUserInc = Math.ceil(PICKED_UP_BY_USER / frames) || 0;
  const inServiceInc = Math.ceil(IN_SERVICE / frames) || 0;
  const readyToDispatchInc = Math.ceil(READY_TO_DISPATCH / frames) || 0;
  const dispatchedInc = Math.ceil(DISPATCHED / frames) || 0;
  const deliveredInc = Math.ceil(DELIVERED / frames) || 0;

  let currentFrame = 0;

  const timer = setInterval(() => {
    currentFrame++;

    // Update states
    setTotal(prev => (prev + totalInc > total ? total : prev + totalInc));
    setReadyToPick(prev => (prev + readyToPickInc > READY_TO_PICK ? READY_TO_PICK : prev + readyToPickInc));
    setPending(prev => (prev + pendingInc > PENDING ? PENDING : prev + pendingInc));
    setCancelled(prev => (prev + cancelledInc > CANCELLED ? CANCELLED : prev + cancelledInc));
    setCompleted(prev => (prev + completedInc > COMPLETED ? COMPLETED : prev + completedInc));
    setPickedUpByPartner(prev => (prev + pickedUpByPartnerInc > PICKED_UP_BY_PARTNER ? PICKED_UP_BY_PARTNER : prev + pickedUpByPartnerInc));
    setPickedUpByUser(prev => (prev + pickedUpByUserInc > PICKED_UP_BY_USER ? PICKED_UP_BY_USER : prev + pickedUpByUserInc));
    setInService(prev => (prev + inServiceInc > IN_SERVICE ? IN_SERVICE : prev + inServiceInc));
    setReadyToDispatch(prev => (prev + readyToDispatchInc > READY_TO_DISPATCH ? READY_TO_DISPATCH : prev + readyToDispatchInc));
    setDispatched(prev => (prev + dispatchedInc > DISPATCHED ? DISPATCHED : prev + dispatchedInc));
    setDelivered(prev => (prev + deliveredInc > DELIVERED ? DELIVERED : prev + deliveredInc));

    if (currentFrame >= frames) {
      clearInterval(timer);
    }
  }, frameDuration);

  return () => clearInterval(timer);
}, [dashboardData]);

  const userCountsByRole = dashboardData?.responseDetails?.userCountsByRole || {};



  useEffect(() =>{
dispatch(GetAllOrderCount())
  },[dispatch])

    {isLoading && <Loading overlay={true} />}

  return (
    <>
  <div className=" md:overflow-y-auto overflow-x-hidden">      
    <div className="bg-gray-100 p-6 h-auto md:min-h-[83vh] overflow-scroll overflow-x-hidden overflow-y-hidden">

    {/* <div className="p-6 w-full flex flex-wrap gap-4"> */}
      <div className="p-6 w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,0.25fr))] relative">

             {/* Show More/Show Less Button */}
<div className="flex justify-end mb-4 absolute top-50 right-0 ">
  <button
    onClick={() => setShowAllCards(!showAllCards)}
    className={`${EditClass}`}
  >
    { showAllCards ? <ArrowUp size={28} /> : <ArrowDown size={28} />}
  </button>
</div>

               {/* Users Card */}
      {/* Dynamic User Roles Cards */}
{Object?.entries(userCountsByRole).map(([role, count]) => (
  <div
    key={role}
    className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]"
  >
    <div className="flex items-center mb-2">
      <Users size={20} className="text-green-500 mr-2" />
      <span className="text-green-500 font-medium capitalize">
        {role}
      </span>
    </div>
    <h2 className="text-3xl font-bold text-gray-800">{count?.toLocaleString()}</h2>
  </div>
))}

      {/* Total Orders */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Package size={20} className="text-blue-600 mr-2" />
          <span className="text-blue-600 font-medium">Total Orders</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{total?.toLocaleString()}</h2>
      </div>

      {/* Pending Orders */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Clock size={20} className="text-orange-500 mr-2" />
          <span className="text-orange-500 font-medium">Pending</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{pending?.toLocaleString()}</h2>
      </div>

      {/* Ready To Pick */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <ClipboardCheck size={20} className="text-purple-600 mr-2" />
          <span className="text-purple-600 font-medium">Ready To Pick</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{readyToPick?.toLocaleString()}</h2>
      </div>

      {/* Cancelled */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <XCircle size={20} className="text-red-500 mr-2" />
          <span className="text-red-500 font-medium">Cancelled</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{cancelled?.toLocaleString()}</h2>
      </div>

      {/* Completed */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <CheckCircle2 size={20} className="text-green-600 mr-2" />
          <span className="text-green-600 font-medium">Completed</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{completed?.toLocaleString()}</h2>
      </div>


     {showAllCards && (
      <>
       {/* Picked Up By Partner */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Truck size={20} className="text-indigo-500 mr-2" />
          <span className="text-indigo-500 font-medium">Picked By Partner</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{pickedUpByPartner?.toLocaleString()}</h2>
      </div>

      {/* Picked Up By User */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <UserCheck size={20} className="text-teal-500 mr-2" />
          <span className="text-teal-500 font-medium">Picked By User</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{pickedUpByUser?.toLocaleString()}</h2>
      </div>

      {/* In Service */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Settings size={20} className="text-purple-700 mr-2" />
          <span className="text-purple-700 font-medium">In Service</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{inService?.toLocaleString()}</h2>
      </div>

      {/* Ready To Dispatch */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Send size={20} className="text-yellow-600 mr-2" />
          <span className="text-yellow-600 font-medium">Ready To Dispatch</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{readyToDispatch?.toLocaleString()}</h2>
      </div>

      {/* Dispatched */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <PackageCheck size={20} className="text-blue-500 mr-2" />
          <span className="text-blue-500 font-medium">Dispatched</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{dispatched?.toLocaleString()}</h2>
      </div>

      {/* Delivered */}
      <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103 w-full max-w-[15rem]">
        <div className="flex items-center mb-2">
          <Check size={20} className="text-green-700 mr-2" />
          <span className="text-green-700 font-medium">Delivered</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{delivered?.toLocaleString()}</h2>
      </div>
      </>
     )}

    </div>



{/* Bottom Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-4 mb-6">
              <div className="bg-white p-6 rounded-md shadow-sm h-72">
          <h3 className="text-gray-700 text-lg font-medium mb-6">Product categories</h3>
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="transparent" strokeWidth="40" stroke="#781C86" strokeDasharray="251.2 502.4" strokeDashoffset="0"></circle>
              <circle cx="100" cy="100" r="80" fill="transparent" strokeWidth="40" stroke="#FF6B35" strokeDasharray="167.5 502.4" strokeDashoffset="-251.2"></circle>
              <circle cx="100" cy="100" r="80" fill="transparent" strokeWidth="40" stroke="#4B23B6" strokeDasharray="62.8 502.4" strokeDashoffset="-418.7"></circle>
              <circle cx="100" cy="100" r="80" fill="transparent" strokeWidth="40" stroke="#BCA4CB" strokeDasharray="41.9 502.4" strokeDashoffset="-481.5"></circle>
            </svg>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-sm text-gray-600">Automobiles</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-800 mr-2"></div>
              <span className="text-sm text-gray-600">Machinery</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-300 mr-2"></div>
              <span className="text-sm text-gray-600">Home decor items</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-900 mr-2"></div>
              <span className="text-sm text-gray-600">Chemicals</span>
            </div>
          </div>
        </div>

{/* Product Visits */}
            <div className="bg-white h-72 p-6 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-700 text-lg font-medium">
                  Product visits
                </h3>
                <div className="relative inline-block text-left">
               <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="border px-3 py-1 rounded-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
                </div>
              </div>

                  <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productVisitData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="period" tickFormatter={(value) => formatDate(value, selectedPeriod)} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 8, fill: "#3B82F6" }}
              isAnimationActive={true}   
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

              </div>
            </div>

    </div>
  </div>

            {/* ADD this overlay loading at the end */}
      {isLoading && <Loading overlay={true} />}
    </>
  );
};

export default Dashboard;