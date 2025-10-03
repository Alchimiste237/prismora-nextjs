import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage }) => {
  return (
    <div className="flex items-center gap-4 my-2">
      <span className="w-1/3 text-lg font-medium text-gray-800 text-right">{label}:</span>
      <div className="w-2/3 flex items-center gap-3">
        <div className="w-full bg-gray-300 rounded-full h-5 border border-gray-400">
          <div
            className="bg-red-600 h-full rounded-full"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label} score`}
          ></div>
        </div>
        <span className="text-red-600 font-bold text-lg w-40 text-nowrap">{`Present (${percentage}%)`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
