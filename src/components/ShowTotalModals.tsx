import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "./Loading";

interface TotalModalProps {
    onClose: () => void;
    selectedBrand: string;
    setSelectedBrand: (brand: string) => void;
}

const ShowTotalModals: React.FC<TotalModalProps> = ({ onClose, selectedBrand, setSelectedBrand }) => {
    const { BrandData, isLoading } = useSelector((state: RootState) => state.BrandSlice);

    if (isLoading) {
        return <Loading />
    }

    const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const brandValue = e.target.value;
        if (brandValue) {
            setSelectedBrand(brandValue);
            onClose(); // Close modal after selection
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm relative">
                    <button
                        className="absolute top-2 right-3 text-gray-600 text-2xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                    <h2 className="text-xl font-semibold mb-4 text-center">Select a Brand</h2>

                    <select
                        value={selectedBrand}
                        onChange={handleBrandSelect}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Brand</option>
                        {BrandData?.map((brand) => (
                            <option key={brand.id} value={brand?.name}>
                                {brand?.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}

export default ShowTotalModals;

