import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';

const ProductPart = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const usersPerPage = 5;
  

  return (
    <div>
      Welcome to Product Part Page
      <p>This page is under construction.</p>
      <p>Please check back later for updates.</p>

    </div>
  )
}

export default ProductPart
