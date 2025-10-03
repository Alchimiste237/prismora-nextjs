
"use client";

import Playlists from "@/../components/Playlists";
import { useAppContext } from "../../context/StateContext";

const PlaylistsPage = () => {
    const { playlists } = useAppContext();
    return <Playlists playlists={playlists} />;
}

export default PlaylistsPage;
