import { enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range';

const DatePicker = ({ value, onChange, sidebarMobileOpen  }) => {
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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDisplayText = () => {
  if (value?.startDate && value?.endDate && 
      value.startDate.getTime() !== value.endDate.getTime()) {
    return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
  } else if (value?.startDate) {
    return formatDate(value.startDate);
  }
  return 'Select date range';
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
    setIsOpen(false)
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
    handleResize(); // Initial check
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  useEffect(() => {
    if (sidebarMobileOpen) {
      setIsOpen(false);
    }
  }, [sidebarMobileOpen]);

  return (
    <div className="relative w-full max-w-lg">
      {/* Input Field */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg bg-transparent cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={value.startDate && value.endDate ? 'text-gray-900' : 'text-gray-500'}>
  {value.startDate && value.endDate ? getDisplayText() : ""}
</span>
        <svg className="w-5 h-5 text-gray-400 hover:text-blue-300 duration:300 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
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
    className={`absolute z-50 bg-white border border-gray-800 rounded-lg shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
    ${screenSize === 'small' 
      ? 'fixed left-5 right-5 top-1/2 transform -translate-y-1/2 max-h-[90vh] w-[85vw]'
      : screenSize === 'medium'
      ? 'left-0 top-full mt-2 max-h-[90vh] w-[85vw]'
      : screenSize === 'large'
      ? 'top-full left-0 mt-2 max-h-[90vh] overflow-hidden overflow-x-auto w-[65vw]'
      : 'top-full left-0 mt-2 max-h-[90vh] w-[65vw]'}
    ${screenSize === 'medium-large' ? 'w-[900px]' : ''}
  `}
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
      rangeColors={['#3b82f6']}
      showDateDisplay={false}
      locale={enUS}
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
        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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

export default DatePicker






