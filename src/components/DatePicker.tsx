import { enUS } from 'date-fns/locale';
import { useState } from 'react'
import { DateRangePicker } from 'react-date-range';

const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <DateRangePicker
              ranges={[selection]}
              onChange={handleSelect}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              className="border-0"
              rangeColors={['#3b82f6']}
              showDateDisplay={false}
              locale={enUS}
            />
            
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

        </>
      )}
    </div>
  );
};

export default DatePicker






