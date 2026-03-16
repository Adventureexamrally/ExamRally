import React, { useEffect, useState } from 'react';
import { MdLeaderboard } from 'react-icons/md';

const Percentile = ({ allScores, overallScore, initialPercentile, totelmark }) => {
    const [value, setValue] = useState(0);
    const [percentile, setPercentile] = useState(0);
    const [isInteractive, setIsInteractive] = useState(false);
    const maxMarks = totelmark || 100;

    const getSortedScores = () => {
        if (!allScores || allScores.length === 0) return [];
        return [...allScores].sort((a, b) => b - a); // Descending
    };

    const calculatePercentileForScore = (score) => {
        const sortedScores = getSortedScores();
        const totalUsers = sortedScores.length;

        if (totalUsers <= 1) return 100;

        const rank = sortedScores.findIndex(s => s <= score) + 1;
        const adjustedRank = rank === 0 ? totalUsers + 1 : rank;

        const percentile = ((totalUsers - adjustedRank) / (totalUsers - 1)) * 100;
        return percentile.toFixed(2);
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

    useEffect(() => {
        if (overallScore >= 0) {
            setValue(overallScore);
            setPercentile(initialPercentile || calculatePercentileForScore(overallScore));
        }
    }, [overallScore, initialPercentile]);

    const tooltipPosition = (value / maxMarks) * 100;

    return (
        <div className='rounded-lg shadow-md p-6 mb-8 border'>
            <label className="flex mb-2 text-xl font-bold text-blue-700 dark:text-white">
                <MdLeaderboard size={25} style={{ marginRight: "10px" }} />
                Percentile Calculator
            </label>

            <div className="relative">
                <input
                    type="range"
                    value={value}
                    min="0"
                    max={maxMarks}
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

            <div className="relative mt-4">
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
    );
};

export default Percentile;
