import { useState, useEffect } from 'react';

const OrderProgressStepper = ({ selectedOrderDetails }) => {
    const [animationProgress, setAnimationProgress] = useState(0);
    const [showSteps, setShowSteps] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${day} ${month}, ${time}`;
    };

    // Animation effect on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSteps(true);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                setAnimationProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 30);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const firstOrder = selectedOrderDetails;

    // Define all steps and filter out those without dates
    const allSteps = [
        {
            name: 'ORDERED',
            label: 'Order Placed',
            date: firstOrder.orderOn,
            completed: !!firstOrder.orderOn
        },
        {
            name: 'PICKUP_SCHEDULED',
            label: 'Pickup Scheduled',
            date: firstOrder.pickupScheduleOn,
            completed: !!firstOrder.pickupScheduleOn
        },
        {
            name: 'PICKED_UP',
            label: 'Picked up',
            date: firstOrder.pickedupUnitFromUserOn,
            completed: !!firstOrder.pickedupUnitFromUserOn
        },
        {
            name: 'RECEIVED_FROM_PARTNER',
            label: 'In Progress',
            date: firstOrder.unitRecievedFromPartnerOn,
            completed: !!firstOrder.unitRecievedFromPartnerOn
        },
        {
            name: 'COMPLETED',
            label: 'Completed',
            date: firstOrder.completedByEngineerOn,
            completed: !!firstOrder.completedByEngineerOn || firstOrder.unitRepairStatus === 'COMPLETED'
        },
        {
            name: 'DELIVERED',
            label: 'Delivered',
            date: firstOrder.deliveredOn,
            completed: !!firstOrder.deliveredOn
        },
        ...(firstOrder.unitRepairStatus === 'CANCELLED' ? [{
            name: 'CANCELLED',
            label: 'Cancelled',
            date: firstOrder.cancelledOn,
            completed: true
        }] : [])
    ].filter(step => step.date); // Only show steps that have dates

    // Calculate completed steps
    const completedSteps = allSteps.filter(step => step.completed);
    const completedCount = completedSteps.length;
    const totalSteps = allSteps.length;

    // Calculate progress percentage
    const progressPercentage = totalSteps > 1 ? ((completedCount - 1) / (totalSteps - 1)) * 100 : 0;
    // const animatedWidth = Math.min(animationProgress, progressPercentage);
    const animatedWidth = (animationProgress / 100) * progressPercentage;

    return (
        <div className="w-full">

            {/* Progress Container */}
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 rounded-full"></div>

                {/* Animated Progress Line */}
                <div
                    className="absolute top-4 left-4 h-1 bg-gray-200 rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: showSteps ? `calc(${animatedWidth}% - 16px + ${(animatedWidth / 100) * 16}px)` : '0%'
                    }}
                ></div>

                {/* Steps Container */}
                <div className="flex justify-between items-start relative">
                    {allSteps.map((step, index) => {
                        const isCompleted = step.completed;
                       const stepDelay = index * 200;

                        return (
                            <div
                                key={step.name}
                                className={`flex flex-col items-start transition-all duration-500 ${showSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${stepDelay}ms`, minWidth: '120px' }}
                            >
                                {/* Circle */}
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 ${isCompleted ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-300'}`}>
                                    {isCompleted && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>

                                {/* Step Info */}
                                <div className="mt-2 text-left">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {step.label}:
                                        </span>
                                    </div>
                                    {step.date ? (
                                        <div className="text-sm font-medium text-gray-800 mt-1">
                                            {formatDate(step.date)}
                                        </div>
                                    ) : null} 
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderProgressStepper;




