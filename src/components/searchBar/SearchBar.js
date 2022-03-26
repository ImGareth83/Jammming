import React, { useState } from "react";
import "./SearchBar.css";
import Spotify from "../../utilities/Spotify";

const SearchBar = ({ resultHandler }) => {
  const [term, setTerm] = useState("");

  const searchTerm = (event) => {
    event.preventDefault();

    Spotify.searchTerm(term).then((data) => resultHandler(data));
    // resultHandler(Spotify.search(term));
  };

  return (
    <div className="SearchBar">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter A Song, Album, or Artist"
      />
      <button className="SearchButton" onClick={searchTerm}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
