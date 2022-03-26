import React, { useState } from "react";

import "./PlayList.css";
import Track from "../track/Track";
import Spotify from "../../utilities/Spotify";

const PlayList = ({ playList, removeTrackHandler, ...props }) => {
  const [playListName, setPlayListName] = useState("New Playlist");

  //save playlist to spotify
  const savePlayListHandler = (playlistName, trackURIs) => {
    if (trackURIs.length > 0) {
      Spotify.savePlayList(playlistName, trackURIs).then((resolved) => {
        alert(`Playlist ${playlistName} saved!`);
      });
    } else {
      alert("No tracks to save");
    }
  };

  let trackComponents = [];
  let URIs = [];

  trackComponents = playList?.map((t, i) => {
    URIs.push(t.uri);
    return (
      <Track
        key={t.id}
        id={t.id}
        name={t.name}
        artist={t.artist}
        album={t.album}
        uri={t.uri}
        isRemoval={true}
        trackHandler={removeTrackHandler}
      />
    );
  });

  return (
    <div className="Playlist">
      <input
        defaultValue={playListName}
        onChange={(e) => setPlayListName(e.target.value)}
      />
      {trackComponents}
      <button
        className="Playlist-save"
        onClick={() => savePlayListHandler(playListName, URIs)}
      >
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default PlayList;
