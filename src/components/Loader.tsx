import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-2 border-4 border-gray-300 rounded-full animate-spin-reverse"></div>
        </div>
      <p className="mt-4 text-gray-500 text-lg">AI is analyzing, please wait...</p>
    </div>
  );
};

export default Loader;
