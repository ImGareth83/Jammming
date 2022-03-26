import React from "react";

import "./TrackList.css";
import Track from "../track/Track";

const TrackList = ({ trackList, trackHandler, ...props }) => {
  let trackComponents = [];
  trackComponents = trackList?.map((t, i) => {
    return (
      <Track
        key={t.id}
        id={t.id}
        name={t.name}
        artist={t.artist}
        album={t.album}
        uri={t.uri}
        isRemoval={false}
        trackHandler={trackHandler}
      />
    );
  });

  return <div className="TrackList">{trackComponents}</div>;
};

export default TrackList;
