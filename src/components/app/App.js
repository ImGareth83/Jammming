import React, { useEffect, useState } from "react";

import "./App.css";
import SearchBar from "../searchBar/SearchBar";
import SearchResults from "../searchResults/SearchResults";
import Playlist from "../playList/PlayList";

import Spotify from "../../utilities/Spotify";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playList, setPlayList] = useState([]);

  const [accessToken, setAccessToken] = useState("");

  //after login, the access token is retrieved and set to state
  useEffect(() => {
    setAccessToken(Spotify.getAccessToken());
  }, [accessToken]);

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

  const loginBody = (
    <div className="App-login-container">
      <button className="App-login-btn" onClick={Spotify.authURL}>
        Login
      </button>
    </div>
  );

  const mainBody = (
    <>
      <SearchBar resultHandler={resultHandler} />
      <div className="App-playlist">
        <SearchResults
          trackList={searchResults}
          addTrackHandler={addTrackHandler}
        />
        <Playlist playList={playList} removeTrackHandler={removeTrackHandler} />
      </div>
    </>
  );

  return (
    <div className="main">
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">{!accessToken ? loginBody : mainBody}</div>
    </div>
  );
};

export default App;
