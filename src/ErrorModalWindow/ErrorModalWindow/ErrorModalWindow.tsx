import { useDispatch, useSelector } from "react-redux";
import { HideErrorModal } from "./ErrorModalWindowSlice";

const ErrorModalWindow = () => {
    const dispatch = useDispatch();
    const { isErrorModalWindow, message } = useSelector((state: any) => state.ErrorModalWindowSlice);

    if (!isErrorModalWindow) return null;
    
    return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[1000]">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">⚠️</div>
        </div>

        {/* Body */}
        <div className="text-center mb-5">
          <h3 className="text-[#f15b55] text-xl font-semibold mb-2">
            Error Occurred
          </h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            className="bg-[#f15b55] hover:bg-[#d44a44] text-white px-6 py-2 rounded-md text-base font-medium transition-all"
            onClick={() => dispatch(HideErrorModal(false))}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModalWindow;