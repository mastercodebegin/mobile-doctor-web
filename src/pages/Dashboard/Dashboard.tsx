import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, YAxis, BarChart, Bar, AreaChart, Area } from 'recharts';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { GetAllOrderCount, GetAllOrdersInGraph } from './DashboardSlice';
import moment from 'moment';
import { Users, Package, Clock, ClipboardCheck, XCircle, CheckCircle2, Truck, UserCheck, Settings, Send, PackageCheck, Check, ArrowUp, ArrowDown } from "lucide-react";
import { DropDownClass, EditClass } from '../../helper/ApplicationConstants';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {

  const { dashboardData, isLoading, productVisitData } = useSelector((state: RootState) => state.DashbaordSlice)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [showAllCards, setShowAllCards] = useState(false)

  console.log(dashboardData, productVisitData)


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

  const userCountsByRole = dashboardData?.responseDetails?.userCountsByRole || {};



  useEffect(() => {
    dispatch(GetAllOrderCount({}))
  }, [dispatch])

  { isLoading && <Loading overlay={true} /> }






  // Function to get the appropriate icon for each status
  const getIconForStatus = (status: string) => {
    switch (status) {
      case 'TOTAL':
        return <Package size={20} className="text-blue-600 mr-2" />;
      case 'PENDING':
        return <Clock size={20} className="text-orange-500 mr-2" />;
      case 'READY_TO_PICK':
        return <ClipboardCheck size={20} className="text-purple-600 mr-2" />;
      case 'IN_SERVICE':
        return <Settings size={20} className="text-purple-700 mr-2" />;
      case 'CANCELLED':
        return <XCircle size={20} className="text-red-500 mr-2" />;
      case 'COMPLETED':
        return <CheckCircle2 size={20} className="text-green-600 mr-2" />;
      case 'PICKED_UP_BY_PARTNER':
        return <Truck size={20} className="text-indigo-500 mr-2" />;
      case 'PICKED_UP_BY_USER':
        return <UserCheck size={20} className="text-teal-500 mr-2" />;
      case 'READY_TO_DISPATCH':
        return <Send size={20} className="text-yellow-600 mr-2" />;
      case 'DISPATCHED':
        return <PackageCheck size={20} className="text-blue-500 mr-2" />;
      case 'DELIVERED':
        return <Check size={20} className="text-green-700 mr-2" />;
      default:
        return <Package size={20} className="text-gray-500 mr-2" />;
    }
  };

  const handleCardClick = (status: string) => {
    navigate("/orders", { state: { status } });
  };












  const data = [
    { month: 'Jan', delivered: 120 },
    { month: 'Feb', delivered: 130 },
    { month: 'Mar', delivered: 90 },
    { month: 'Apr', delivered: 60 },
    { month: 'May', delivered: 130 },
    { month: 'Jun', delivered: 251 },
    { month: 'Jul', delivered: 235 },
    { month: 'Jan', delivered: 120 },
    { month: 'Feb', delivered: 130 },
    { month: 'Mar', delivered: 90 },
    { month: 'Apr', delivered: 60 },
    { month: 'May', delivered: 130 },
    { month: 'Jun', delivered: 251 },
    { month: 'Jul', delivered: 235 },
  ];


  const dataTop = [
    { month: 'Jan 01', total: 22, avg: 20 },
    { month: 'Feb 01', total: 15, avg: 28 },
    { month: 'Mar 01', total: 20, avg: 32 },
    { month: 'Apr 01', total: 35, avg: 35 },
    { month: 'May 01', total: 40, avg: 45 },
    { month: 'Jun 01', total: 50, avg: 55 },
    { month: 'Jul 01', total: 60, avg: 62 },
    { month: 'Aug 01', total: 55, avg: 48 },
    { month: 'Sep 01', total: 45, avg: 52 },
    { month: 'Oct 01', total: 30, avg: 60 },
    { month: 'Nov 01', total: 35, avg: 50 },
    { month: 'Dec 01', total: 40, avg: 40 },
  ];




  return (
    <>
      <div className=" md:overflow-y-auto overflow-x-hidden">
        <div className="bg-gray-100 p-6 h-auto md:min-h-[83vh] overflow-scroll overflow-x-hidden overflow-y-hidden">

          {/* Department wise monthly sales report */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Department wise monthly sales report
      </h2>

      {/* Sales Summary */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">$21,356.46</h3>
          <p className="text-gray-500 text-sm">Total Sales</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">$1935.6</h3>
          <p className="text-gray-500 text-sm">Average</p>
        </div>
      </div>

      {/* Chart Container with Scrollbar */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="min-w-[700px] h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataTop} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: "#6B7280" }} />
              <YAxis tick={{ fill: "#6B7280" }} />
              <Tooltip cursor={{ fill: "rgba(156,163,175,0.1)" }} />
              <Area type="monotone" dataKey="avg" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="total" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

{/* Top Row */}
          {/* <div className="flex items-center justify-between space-x-5 my-3 p-3"> */}
          <div className="flex flex-col lg:flex-row w-full justify-between space-y-5 lg:space-y-0 lg:space-x-5 my-3 p-3">

            {/* Left Section */}
            <div className="flex flex-col w-full lg:w-1/2 space-y-6">
              {/* Top-Section :- User Card's Section */}
              <div className="flex flex-wrap justify-start">
                {Object?.entries(userCountsByRole).map(([role, count]) => (
                  <div
                    key={role}
                    className="bg-white px-6 pt-2 border-x border-gray-100 hover:shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-105 w-full sm:w-[50%] lg:w-[33%] max-w-[16rem]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Users size={20} className="text-green-500 mr-2" />
                      <div className="flex items-center flex-col mb-2">
                        <h2 className="text-md font-bold text-gray-800">{count?.toLocaleString()}</h2>
                        <span className="font-small capitalize">
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

{/* Middle-Section :- Status Card's Section */}
              <div className="flex flex-wrap justify-start">
                {Object.entries(dashboardData?.responseDetails?.ordersCounts || {}).map(([status, count], index) => (
                  <div
                    key={status}
                    className={`bg-white px-6 py-2 border-x border-gray-100 hover:shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-105 w-full sm:w-[50%] lg:w-[33%] max-w-[16rem] ${index >= 3 && !showAllCards ? 'hidden' : ''}`}
                    onClick={() => handleCardClick(status)}
                  >
                    <div className="flex justify-between items-center">
                      <div>{getIconForStatus(status)}</div>
                      <div className="flex flex-col items-center mb-2">
                        <h2 className="text-md font-bold text-gray-800">{count.toLocaleString()}</h2>
                        <span className="font-small capitalize">{status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom-Section :- Graph */}
              <div className="flex flex-col md:flex-row w-full justify-between space-y-5 md:space-y-0 md:space-x-3">

                {/* Left-Card :- Conversion Rate */}
                <div className="bg-white rounded-xl shadow p-8 flex flex-col justify-between w-full md:w-1/2 min-w-[250px]">
                  <div>
                    <div className="text-3xl font-semibold">53.94%</div>
                    <div className="text-md font-medium text-purple-500 mb-4">Conversion Rate</div>
                    <div className="text-gray-600 text-base font-normal mb-8">Number of conversions divided by the total visitors.</div>
                  </div>
                  {/* Chart line above, numbers below in purple */}
                  <div className="w-full flex flex-col items-center justify-end mt-auto">
                    <svg
                      width="100%"
                      height="52"
                      viewBox={`0 0 ${330 * (100 / 100)} 52`}
                      className="block mb-[-6px]"
                      preserveAspectRatio="xMinYMid slice"
                    >
                      <defs>
                        <linearGradient id="purpleArea" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#A99EFF" stopOpacity="0.20" />
                          <stop offset="100%" stopColor="#A99EFF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,40 Q40,34 65,48 Q83,34 110,19 Q140,22 160,34 Q180,50 210,29 Q240,14 270,41 Q305,47 330,41 L330,52 L0,52 Z"
                        fill="url(#purpleArea)"
                      />
                      <path
                        d="M0,40 Q40,34 65,48 Q83,34 110,19 Q140,22 160,34 Q180,50 210,29 Q240,14 270,41 Q305,47 330,41"
                        stroke="#A99EFF"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                    {/* Numbers and years inside purple box */}
                    <div className="w-full bg-[#A99EFF] rounded-b-xl py-5 pb-5 flex justify-evenly items-end">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-white leading-tight">10</span>
                        <span className="text-base text-white mt-1">2018</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-white leading-tight">15</span>
                        <span className="text-base text-white mt-1">2017</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-white leading-tight">13</span>
                        <span className="text-base text-white mt-1">2016</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right-Card :- Order Delivered */}
                <div className="bg-white rounded-xl shadow p-8 flex flex-col justify-between w-full md:w-1/2 min-w-[250px]">
                  <div>
                    <div className="text-3xl font-semibold">1432</div>
                    <div className="text-md font-medium text-purple-500 mb-4">Order Delivered</div>
                    <div className="text-gray-600 text-base font-normal mb-6">
                      Number of conversions divided by the total visitors.
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-xl font-semibold">130</div>
                      <div className="text-xl font-semibold">251</div>
                      <div className="text-xl font-semibold">235</div>
                    </div>
                    <div className="flex items-end justify-between mb-4 text-base text-gray-600">
                      <div>May</div>
                      <div>June</div>
                      <div>July</div>
                    </div>
                  </div>
                  {/* <svg viewBox="0 0 320 50" height="50" className="w-full" style={{ minWidth: 0 }}>
                    <rect x="5" y="20" width="7" height="28" rx="2" fill="#A99EFF" />
                    <rect x="17" y="28" width="7" height="20" rx="2" fill="#A99EFF" />
                    <rect x="29" y="24" width="7" height="24" rx="2" fill="#A99EFF" />
                    <rect x="41" y="30" width="7" height="18" rx="2" fill="#A99EFF" />
                    <rect x="53" y="22" width="7" height="26" rx="2" fill="#A99EFF" />
                    <rect x="65" y="35" width="7" height="13" rx="2" fill="#A99EFF" />
                    <rect x="77" y="28" width="7" height="20" rx="2" fill="#A99EFF" />
                    <rect x="89" y="15" width="7" height="33" rx="2" fill="#A99EFF" />
                    <rect x="101" y="32" width="7" height="16" rx="2" fill="#A99EFF" />
                    <rect x="113" y="25" width="7" height="23" rx="2" fill="#A99EFF" />
                    <rect x="125" y="30" width="7" height="18" rx="2" fill="#A99EFF" />
                    <rect x="137" y="20" width="7" height="28" rx="2" fill="#A99EFF" />
                    <rect x="149" y="36" width="7" height="12" rx="2" fill="#A99EFF" />
                    <rect x="161" y="10" width="7" height="38" rx="2" fill="#A99EFF" />
                    <rect x="173" y="29" width="7" height="19" rx="2" fill="#A99EFF" />
                    <rect x="185" y="32" width="7" height="16" rx="2" fill="#A99EFF" />
                    <rect x="197" y="38" width="7" height="10" rx="2" fill="#A99EFF" />
                    <rect x="209" y="26" width="7" height="22" rx="2" fill="#A99EFF" />
                    <rect x="221" y="32" width="7" height="16" rx="2" fill="#A99EFF" />
                    <rect x="233" y="27" width="7" height="21" rx="2" fill="#A99EFF" />
                    <rect x="245" y="35" width="7" height="13" rx="2" fill="#A99EFF" />
                    <rect x="257" y="13" width="7" height="35" rx="2" fill="#A99EFF" />
                    <rect x="269" y="36" width="7" height="12" rx="2" fill="#A99EFF" />
                    <rect x="281" y="20" width="7" height="28" rx="2" fill="#A99EFF" />
                    <rect x="293" y="10" width="7" height="38" rx="2" fill="#A99EFF" />
                    <rect x="305" y="24" width="7" height="24" rx="2" fill="#A99EFF" />
                  </svg> */}
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={data}>
                        <Tooltip />
                        <Bar dataKey="delivered" fill="#A99EFF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right-Section :- Department wise monthly sales report section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md w-full lg:w-1/2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Department wise monthly sales report
              </h2>

              <hr className='mb-5 text-gray-200' />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-4">
                {/* Total Sales and Average */}
                <div className="flex items-center gap-10">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">$21,356.46</h1>
                    <h3 className="text-gray-500 text-md">Total Sales</h3>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">$1935.6</h1>
                    <h3 className="text-gray-500 text-md">Average</h3>
                  </div>
                </div>

                {/* Chart controls (icons) */}
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <button className="hover:text-blue-600 transition"><i className="fa fa-plus"></i></button>
                  <button className="hover:text-blue-600 transition"><i className="fa fa-minus"></i></button>
                  <button className="hover:text-blue-600 transition"><i className="fa fa-hand-paper"></i></button>
                  <button className="hover:text-blue-600 transition"><i className="fa fa-home"></i></button>
                </div>
              </div>

              {/* Graph Section */}
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="min-w-[600px] h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Jan 01", total: 22 },
                      { month: "Feb 01", total: 12 },
                      { month: "Mar 01", total: 23 },
                      { month: "Apr 01", total: 10 },
                      { month: "May 01", total: 40 },
                      { month: "Jul 01", total: 37 },
                      { month: "Aug 01", total: 20 },
                      { month: "Oct 01", total: 45 },
                      { month: "Nov 01", total: 28 },
                      { month: "Dec 01", total: 40 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-10 text-sm mt-3">
                <p className="text-blue-600 font-medium cursor-pointer hover:underline">Total Sales</p>
                <p className="text-gray-400 font-medium cursor-pointer hover:underline">Average</p>
              </div>
            </div>
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
                    className={DropDownClass}
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