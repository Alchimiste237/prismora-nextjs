"use client";

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Prismora</h1>
      <div className="text-left text-gray-700 space-y-6">
        <p className="text-lg leading-relaxed">
          Prismora is a revolutionary platform designed to empower parents in creating a safe and enriching online environment for their children. Our mission is to protect young minds from inappropriate content while fostering positive digital experiences.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Vision</h2>
        <p className="leading-relaxed">
          We envision a world where children can explore the vast resources of the internet without fear, guided by intelligent tools that understand and respect family values. Prismora uses advanced AI technology to analyze video content and provide parents with detailed insights about what their children are watching.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How It Works</h2>
        <ul className="list-disc list-inside space-y-2 leading-relaxed">
          <li><strong>Smart Analysis:</strong> Our AI scans YouTube videos for various content categories including adult visuals, aggressive behavior, inappropriate language, and more.</li>
          <li><strong>Personalized Playlists:</strong> Parents can create curated playlists tailored to their child's age and interests.</li>
          <li><strong>Child-Safe Mode:</strong> Switch to a restricted interface that only shows approved content.</li>
          <li><strong>Real-Time Monitoring:</strong> Keep track of viewing history and content consumption patterns.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Commitment</h2>
        <p className="leading-relaxed">
          At Prismora, we are committed to privacy, safety, and education. We believe that technology should serve families, not complicate them. Our platform is built with the highest standards of data protection and user experience in mind.
        </p>
        <p className="leading-relaxed">
          Join thousands of parents who trust Prismora to help them navigate the digital world with confidence.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
