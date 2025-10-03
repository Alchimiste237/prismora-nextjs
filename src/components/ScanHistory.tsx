"use client";

import React from 'react';
import { useAppContext } from '../context/StateContext';
import type { AnalysisReport, VideoDetails } from '../../types';

interface ScanEntry {
  url: string;
  analysisResult: AnalysisReport;
  videoDetails: VideoDetails;
  timestamp: string;
}

const ScanHistory: React.FC = () => {
  const { scanHistory, clearScanHistory, user } = useAppContext();

  if (!user) {
    return <p className="text-center text-gray-600 mt-8">Please log in to view your scan history.</p>;
  }

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      await clearScanHistory();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Recent Scan History</h2>
        {scanHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Clear All History
          </button>
        )}
      </div>
      {scanHistory.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">No scan history found.</p>
      ) : (
        <ul className="space-y-6">
          {scanHistory.map((scan: ScanEntry, index: number) => (
            <li key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={scan.videoDetails.thumbnailUrl}
                  alt={`Thumbnail for ${scan.analysisResult.videoTitle}`}
                  className="w-24 h-18 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{scan.analysisResult.videoTitle}</h3>
                  <p className="text-gray-600 mb-2">{scan.analysisResult.channelName}</p>
                  <p className="text-sm text-gray-500 mb-4">Scanned on: {new Date(scan.timestamp).toLocaleString()}</p>
                  <a
                    href={scan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Watch Video
                  </a>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
                    <p className="text-sm text-gray-700">
                      Primary Concern: {scan.analysisResult.adultVisuals > scan.analysisResult.aggressiveBehavior &&
                        scan.analysisResult.adultVisuals > scan.analysisResult.nonTraditionalRelationships &&
                        scan.analysisResult.adultVisuals > scan.analysisResult.inappropriateLanguage &&
                        scan.analysisResult.adultVisuals > scan.analysisResult.lgbtqRepresentation
                        ? 'Adult Visuals'
                        : scan.analysisResult.aggressiveBehavior > scan.analysisResult.nonTraditionalRelationships &&
                          scan.analysisResult.aggressiveBehavior > scan.analysisResult.inappropriateLanguage &&
                          scan.analysisResult.aggressiveBehavior > scan.analysisResult.lgbtqRepresentation
                        ? 'Aggressive Behavior'
                        : scan.analysisResult.nonTraditionalRelationships > scan.analysisResult.inappropriateLanguage &&
                          scan.analysisResult.nonTraditionalRelationships > scan.analysisResult.lgbtqRepresentation
                        ? 'Non-Traditional Relationships'
                        : scan.analysisResult.inappropriateLanguage > scan.analysisResult.lgbtqRepresentation
                        ? 'Inappropriate Language'
                        : 'LGBTQ Representation'} ({Math.max(
                        scan.analysisResult.adultVisuals,
                        scan.analysisResult.aggressiveBehavior,
                        scan.analysisResult.nonTraditionalRelationships,
                        scan.analysisResult.inappropriateLanguage,
                        scan.analysisResult.lgbtqRepresentation
                      )}%)
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScanHistory;
