import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const Dashboard = () => { 

    // State for animating numbers
  const [customerCount, setCustomerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  
  // Chart data
  const [productVisitsData] = useState([
    { name: 'Mon', visits: 400 },
    { name: 'Tue', visits: 950 },
    { name: 'Wed', visits: 550 },
    { name: 'Thu', visits: 600 },
    { name: 'Fri', visits: 720 },
    { name: 'Sat', visits: 950 },
    { name: 'Sun', visits: 650 },
  ]);

  // Animate counting up effect
  useEffect(() => {
    const animationDuration = 1500;
    const frameDuration = 16;
    const frames = animationDuration / frameDuration;
    
    const customerIncrement = Math.ceil(45679 / frames);
    const orderIncrement = Math.ceil(80927 / frames);
    const deliveryIncrement = Math.ceil(22339 / frames);
    const userIncrement = Math.ceil(1900 / frames);
    
    let currentFrame = 0;
    
    const timer = setInterval(() => {
      currentFrame++;
      
      setCustomerCount(prev => 
        prev + customerIncrement > 45679 ? 45679 : prev + customerIncrement
      );
      
      setOrderCount(prev => 
        prev + orderIncrement > 80927 ? 80927 : prev + orderIncrement
      );
      
      setDeliveryCount(prev => 
        prev + deliveryIncrement > 22339 ? 22339 : prev + deliveryIncrement
      );
      
      setUserCount(prev => 
        prev + userIncrement > 1900 ? 1900 : prev + userIncrement
      );
      
      if (currentFrame >= frames) {
        clearInterval(timer);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, []);


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
            <span className="text-purple-700 font-medium">Customers</span>
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
            <span className="text-orange-500 font-medium">Orders</span>
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
            <span className="text-purple-600 font-medium">Delivery</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{deliveryCount.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm mt-1">Decrease by 2%</p>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-4">
        {/* Product Categories */}
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
        <div className="bg-white p-6 rounded-md shadow-sm h-72">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-700 text-lg font-medium">Product visits</h3>
            <div className="relative">
              <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md flex items-center text-sm">
                This week
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productVisitsData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#781C86" 
                  strokeWidth={2}
                  dot={{ 
                    fill: "#FFF", 
                    stroke: "#FF6B35", 
                    strokeWidth: 2, 
                    r: 5 
                  }}
                  activeDot={{ r: 8, fill: "#FF6B35", stroke: "#FFF" }}
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