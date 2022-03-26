import React from "react";

import "./SearchResults.css";
import TrackList from "../trackList/TrackList";

const SearchResults = ({ trackList, addTrackHandler, ...props }) => (
  <div className="SearchResults">
    <h2>Results</h2>
    <TrackList trackList={trackList} trackHandler={addTrackHandler} />
  </div>
);

export default SearchResults;
