import React from "react";

import "./Track.css";

const Track = ({
  id,
  name,
  artist,
  album,
  uri,
  isRemoval,
  trackHandler,
  ...props
}) => {
  const updateTrack = (event, id, name, artist, album, uri) => {
    event.preventDefault();
    // event.target.id;
    let track = { id: id, name: name, artist: artist, album: album, uri: uri };
    trackHandler(track);
    isRemoval = !isRemoval;
  };

  return (
    <div className="Track" key={id}>
      <div className="Track-information">
        <h3 className="Track-text-overflow">{album}</h3>
        <p className="Track-text-overflow">
          {artist} | {name}
        </p>
      </div>
      <button
        className="Track-action"
        id={id}
        onClick={(e) => {
          updateTrack(e, id, name, artist, album, uri);
        }}
      >
        {isRemoval ? "-" : "+"}
      </button>
    </div>
  );
};

export default Track;
