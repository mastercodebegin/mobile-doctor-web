import React from 'react';
import { ThemeBackgroundColor } from './ApplicationConstants';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
totalCount,
  itemsPerPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sm:flex-row flex-col">
      <div className="text-sm text-gray-500">
        Showing {Math.min(itemsPerPage, totalCount - (currentPage - 1) * itemsPerPage)} out of {totalCount} entries
      </div>

      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <button 
          onClick={handlePrevious}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-white flex items-center justify-center rounded transition-colors duration-200 
              ${currentPage === page 
                ? `${ThemeBackgroundColor}` 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={handleNext}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
