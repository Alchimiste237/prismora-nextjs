"use client";

import React from "react";
import { StateProvider, useAppContext } from '../context/StateContext';
import MainLayout from "../components/mainlayout";
import ChildView from "../components/ChildView";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import "./globals.css";

// This component determines which view to show
const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, user, playlists, switchToParentMode, videoToAddToPlaylist, setVideoToAddToPlaylist, handleAddToPlaylist } = useAppContext();

  if (mode === 'child' && user) {
    return <ChildView playlists={playlists} onSwitchToParentMode={switchToParentMode} />;
  }
  
  return (
    <MainLayout>
      {children}
      {videoToAddToPlaylist && (
        <AddToPlaylistModal
          playlists={playlists}
          onClose={() => setVideoToAddToPlaylist(null)}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}
    </MainLayout>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Prismora - Empowering Parents, Protecting Children</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-100">
        <StateProvider>
            <AppContent>{children}</AppContent>
        </StateProvider>
      </body>
    </html>
  );
}
