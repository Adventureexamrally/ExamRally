import React, { useEffect, useState } from 'react'

const Percentile = ({ alluserDetails, overallScore, initialPercentile ,totelmark}) => {
    const [value, setValue] = useState(0);
    const [percentile, setPercentile] = useState(0);
    const [isInteractive, setIsInteractive] = useState(false);
    const maxMarks = totelmark || 100; // Use provided total marks or default to 100

    // Transform API data to expected format and sort
    const getSortedScores = () => {
        if (!alluserDetails || alluserDetails.length === 0) return [];
        return alluserDetails
            .map(user => ({ score: user.o_score })) // Convert o_score to score
            .sort((a, b) => b.score - a.score); // Descending order
    };

    const calculatePercentileForScore = (score) => {
        const sortedUsers = getSortedScores();
        if (sortedUsers.length === 0) return 0;
        
        // Find the rank (1-based index of first user with score <= current score)
        const rank = sortedUsers.findIndex(user => user.score <= score) + 1;
        
        // If no users have lower score, rank is totalUsers + 1
        const adjustedRank = rank === 0 ? sortedUsers.length + 1 : rank;
        
        // Calculate percentile using your specified formula
        return (100 - ((adjustedRank / sortedUsers.length) * 100)).toFixed(2);
    };

    const handleSliderChange = (event) => {
        const newValue = parseInt(event.target.value);
        setValue(newValue);
        
        if (isInteractive) {
            setPercentile(calculatePercentileForScore(newValue));
        }
    };

    const handleInteractionStart = () => {
        if (!isInteractive) {
            setIsInteractive(true);
            setPercentile(calculatePercentileForScore(value));
        }
    };

    // Initialize with server values
    useEffect(() => {
        if (overallScore >= 0) { // Handle 0 scores
            setValue(overallScore);
            setPercentile(initialPercentile || 0);
        }
    }, [overallScore, initialPercentile]);
    // Calculate the percentage position (0-100) based on maxMarks
    const tooltipPosition = (value / maxMarks) * 100;

    return (
        <div className='p-2'>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Percentile Calculator
            </label>
            <div className="relative">
                <input
                    type="range"
                    value={value}
                    min="0"
                    max={maxMarks}  // Use totalMarks or default to 100
                    step="1"
                    onChange={handleSliderChange}
                    onMouseDown={handleInteractionStart}
                    onTouchStart={handleInteractionStart}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-8"
                />
                <span
                    className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-green-500 px-3 p-1 text-sm font-medium text-white"
                    style={{ left: `${tooltipPosition}%` }}
                >
                    <p><strong>Score:</strong> {value}</p>
                    <p><strong>Percentile:</strong> {percentile}%</p>
                </span>
            </div>
        
            <div className="relative">
                <div className="flex justify-between text-xs">
                    {[...Array(6)].map((_, index) => {
                        const markValue = Math.round((maxMarks / 5) * index);
                        return (
                            <div key={markValue} className="flex flex-col items-center">
                                <div className="h-2 w-0.5 bg-gray-600 dark:bg-gray-300 mt-1" />
                                <span>{markValue}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Percentile