import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { capitalizeEachWord, SubmitButtonClass } from '../../helper/ApplicationConstants';
import Loading from '../../components/Loading';

const Settings = () => {
  const { data, isLoading } = useSelector((state: RootState) => state.UserLoginSlice);

  // Extract response object
  const userDetails = data || {};
  const vendorDetails = userDetails?.vendor || null;

  // Merge admin/manager fields into one object
  const detailsToShow = vendorDetails ? { ...userDetails, ...vendorDetails } : userDetails;

  // Fields to hide (like password, deviceToken etc.)
  const hiddenFields = ["id", "password", "deviceToken", "vendor", "vendorDocument"];

  // Convert object to entries
  const fields = Object.entries(detailsToShow).filter(
    ([key, value]) => value && !hiddenFields.includes(key)
  );

  // Profile image fallback
  const profilePic = data?.responseDetails?.picturePath;
  const initials = `${userDetails?.firstName?.[0]?.charAt(0)?.toUpperCase() || "AK"}`;

      {isLoading && <Loading overlay={true} />}

  return (
<>
    <div className=" p-10 rounded-lg ">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-400 border flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-black text-3xl">{capitalizeEachWord(userDetails?.firstName) || "Alfaiz"}</h4>
            <p className="text-lg text-gray-600">{userDetails?.email}</p>
          </div>
        </div>
        <button className={SubmitButtonClass}>Update Picture</button>
      </div>

      {/* Dynamic Fields */}
      <div className="p-6 border border-gray-300 rounded-xl">      
        <h3 className='w-full font-semibold text-2xl mb-6' >Contact Details</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
  {fields.map(([key, value], i) => (
    <div key={i} className="w-full transform transition-all duration-300 hover:scale-103 ">
      <label className="block text-sm mb-3 font-medium text-black capitalize">
        {key.replace(/([A-Z])/g, " $1")}
      </label>
      <div className=" p-3 rounded-md border-gray-300 border border-gray-300 shadow-sm">
        {typeof value === "object" 
          ? capitalizeEachWord(value?.name) || capitalizeEachWord(JSON.stringify(value)) 
          : capitalizeEachWord(String(value))}
      </div>
    </div>
  ))}
</div>
</div>
    </div>

        {isLoading && <Loading overlay={true} />}
</>
  );
};

export default Settings;
