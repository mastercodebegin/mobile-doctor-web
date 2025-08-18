import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, YAxis } from 'recharts';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import useAuthStatus from '../../hooks/useAuthStatus';
import { GetAllOrderCount, GetAllOrdersInGraph } from './DashboardSlice';
import moment from 'moment';

const Dashboard = () => { 

  const {data} = useSelector((state:RootState) => state.UserLoginSlice)
  const {loggedIn} = useAuthStatus()
  const {dashboardData, isLoading, productVisitData} = useSelector((state: RootState) => state.DashbaordSlice)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

    // State for animating numbers
  const [customerCount, setCustomerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  
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

  const { total, READY_TO_PICK, PENDING } = dashboardData.responseDetails;

  const customerIncrement = Math.ceil(total / frames);
  const orderIncrement = Math.ceil(PENDING / frames);
  const deliveryIncrement = Math.ceil(READY_TO_PICK / frames);
  const userIncrement = Math.ceil(1900 / frames); // <-- ye abhi static rakha hai

  let currentFrame = 0;

  const timer = setInterval(() => {
    currentFrame++;

    setCustomerCount(prev =>
      prev + customerIncrement > total ? total : prev + customerIncrement
    );

    setOrderCount(prev =>
      prev + orderIncrement > PENDING ? PENDING : prev + orderIncrement
    );

    setDeliveryCount(prev =>
      prev + deliveryIncrement > READY_TO_PICK ? READY_TO_PICK : prev + deliveryIncrement
    );

    setUserCount(prev =>
      prev + userIncrement > 1900 ? 1900 : prev + userIncrement
    );

    if (currentFrame >= frames) {
      clearInterval(timer);
    }
  }, frameDuration);

  return () => clearInterval(timer);
}, [dashboardData]);


  useEffect(() =>{
dispatch(GetAllOrderCount())
  },[dispatch])

useEffect(() => {
  if (!loggedIn) {
    navigate("/login", { replace: true });
  } else if (data?.role?.name === "customer") {
    navigate("/orders", { replace: true });
  } else if (data?.role?.name === "admin") {
    navigate("/", { replace: true });
  } else if (data?.role?.name === "vendor") {
    navigate("/product-part", {replace: true})
  }
}, [loggedIn, data, navigate]);


if(isLoading){
 return <Loading />
}

  return (
    <>
    
  <div className="h-[calc(95vh-80px)] overflow-y-auto overflow-x-hidden">
       

    <div className="bg-gray-100 p-6 h-auto md:min-h-[83vh] overflow-scroll overflow-x-hidden overflow-y-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Users Card */}
        <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103">
          <div className="flex items-center mb-2">
            <span className="text-green-500 font-medium">Users</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">+{userCount.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm mt-1">Steady growth</p>
        </div>
       
        {/* Customers Card */}
        <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103">
          <div className="flex items-center mb-2">
            <div className="text-purple-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="text-purple-700 font-medium">In Service</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{customerCount.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm mt-1">Increase by 20%</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103">
          <div className="flex items-center mb-2">
            <div className="text-orange-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <span className="text-orange-500 font-medium">Pending</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{orderCount.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm mt-1">Increase by 60%</p>
        </div>

        {/* Delivery Card */}
        <div className="bg-white p-6 rounded-md shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-103">
          <div className="flex items-center mb-2">
            <div className="text-purple-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <span className="text-purple-600 font-medium">Ready To Dispatch</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{deliveryCount.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm mt-1">Decrease by 2%</p>
        </div>

      </div>

{/* Bottom Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-4">
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
              isAnimationActive={true}   // ✅ Sirf ek baar animate hoga
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

              </div>
            </div>

    </div>
  </div>
    </>
  );
};

export default Dashboard;