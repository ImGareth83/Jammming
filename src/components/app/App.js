import React, { useState } from "react";

import "./App.css";
import SearchBar from "../searchBar/SearchBar";
import SearchResults from "../searchResults/SearchResults";
import Playlist from "../playList/PlayList";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playList, setPlayList] = useState([]);

  //display tracks in SearchResults
  const resultHandler = (trackList) => {
    setSearchResults(trackList);
  };

  //remove track from Playlist
  const removeTrackHandler = (track) => {
    //filter out removed track from playlist
    setPlayList((list) => list.filter((t) => t.id !== track.id));
  };

  //add track to Playlist
  const addTrackHandler = (track) => {
    setPlayList((list) =>
      //add track if track do not exist in the list
      list.find((t) => t.id === track.id) ? list : [...list, track]
    );
  };

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar resultHandler={resultHandler} />
        <div className="App-playlist">
          <SearchResults
            trackList={searchResults}
            addTrackHandler={addTrackHandler}
          />
          <Playlist
            playList={playList}
            removeTrackHandler={removeTrackHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
