import { enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range';

const DatePicker = ({ value, onChange, sidebarMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('large');

  const [selection, setSelection] = useState({
    startDate: value?.startDate || new Date(),
    endDate: value?.endDate || new Date(),
    key: 'selection'
  });

  const handleSelect = (ranges) => {
    const newSelection = ranges.selection;
    setSelection(newSelection);
  };

  const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // yyyy-mm-dd
};


  const formatDateInput = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
  };

  const handleApply = () => {
    if (onChange) {
      onChange({
        startDate: selection.startDate,
        endDate: selection.endDate
      });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedSelection = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    };
    setSelection(clearedSelection);
    if (onChange) {
      onChange({
        startDate: null,
        endDate: null
      });
    }
    setIsOpen(false);
  };

  // Set Screen Size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('small');
      } else if (window.innerWidth < 1024) {
        setScreenSize('medium');  
      } else if (window.innerWidth < 1270) {
        setScreenSize('large');
      } else {
        setScreenSize('medium-large');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarMobileOpen) {
      setIsOpen(false);
    }
  }, [sidebarMobileOpen]);

  return (
    <div className="relative w-full">
      {/* From and To Input Fields */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* From Field */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">From:</label>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-gray-700 text-sm">
              {formatDateInput(value?.startDate) || "YYYY-MM-DD"}
            </span>
            <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* To Field */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">To:</label>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-gray-700 text-sm">
              {formatDateInput(value?.endDate) || "YYYY-MM-DD"}
            </span>
            <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Calendar */}
          <div 
          //   className={`absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          //   ${screenSize === 'small' 
          //     ? 'fixed left-5 right-5 top-1/2 transform -translate-y-1/2 max-h-[90vh] w-[85vw]'
          //     : screenSize === 'medium'
          //     ? 'left-0 top-full mt-2 max-h-[90vh] w-[85vw]'
          //     : screenSize === 'large'
          //     ? 'top-full left-0 mt-2 max-h-[90vh] overflow-hidden overflow-x-auto w-[65vw]'
          //     : 'top-full left-0 mt-2 max-h-[90vh] w-[65vw]'}
          //   ${screenSize === 'medium-large' ? 'w-[900px]' : ''}
          // `}

                className={`absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
      ${screenSize === 'small' 
        ? 'fixed left-5 right-5 top-1/2 transform -translate-y-1/2 max-h-[90vh]'
        : screenSize === 'medium'
        ? 'left-0 top-full mt-2 max-h-[90vh] w-full'
        : screenSize === 'large'
        ? 'top-full left-0 mt-2 max-h-[90vh] overflow-hidden overflow-x-auto w-full'
        : 'top-full left-0 mt-2 max-h-[90vh] w-full'}
    `}

//     className={`absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
//   ${screenSize === 'small' 
//     ? 'fixed left-0 right-0 top-0 bottom-0 m-0 w-full h-full max-h-none'
//     : 'top-full left-0 mt-2 w-[50vw] max-h-[90vh]'}
// `}

          >
            <div className="h-full overflow-y-auto" style={{ maxHeight: screenSize === 'small' ? '90vh' : '90vh' }}>
              <DateRangePicker
                ranges={[selection]}
                onChange={handleSelect}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={
                  screenSize === 'small' ? 1 : 
                  screenSize === 'medium' || screenSize === 'large' ? 2 : 
                  2
                }
                direction={screenSize === 'small' ? 'vertical' : 'horizontal'}
                className="border-0 w-full"
                rangeColors={['#06b6d4']}
                showDateDisplay={false}
                locale={enUS}
                // staticRanges={[]}
                inputRanges={[]}
              />
                
              {/* Action Buttons */}
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={handleClear}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={handleApply}
                  className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>  
      )}
    </div>
  );
};

export default DatePicker;