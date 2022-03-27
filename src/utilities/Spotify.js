const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;

const RESPONSE_TYPE = "token";
const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-public"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

let accessToken;

const Spotify = {
  authURL() {
    const accessUrl = `${ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPES_URL_PARAM}&redirect_uri=${REDIRECT_URI}`;
    window.location = accessUrl;
  },
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenHash = window.location.href.match(/access_token=([^&]*)/);
    const expiresInHash = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenHash && expiresInHash) {
      let token = tokenHash[1];
      accessToken = token;
      const expiresIn = Number(expiresInHash[1]);

      console.log(`expires in ${expiresIn * 1000}`);
      const expiryTime = new Date(expiresIn * 1000 * 60); //60 seconds
      window.setTimeout(() => (token = ""), expiresIn * 1000);
      window.location.hash = "";
      window.localStorage.setItem("accessToken", token);
      window.localStorage.setItem("expiresIn", expiryTime);
    }
    return accessToken;
  },
  async searchTerm(t) {
    const searchUrl = `https://api.spotify.com/v1/search?q=${t}&type=track&limit=10`;
    let trackList;
    try {
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer  ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const jsonResponse = await response.json();
      trackList = jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      throw new Error(error);
    }

    return trackList;
  },
  async savePlayList(playlistName, trackURIs) {
    const saveURL = "https://api.spotify.com/v1/me";
    const headers = { Authorization: `Bearer ${accessToken}` };

    let response = await fetch(saveURL, {
      headers: headers,
    });

    if (!response.ok) throw new Error(response.statusText);
    let jsonResponse = await response.json();
    const userId = jsonResponse.id;
    //====================================================================================
    const savePlaylistURL = `https://api.spotify.com/v1/users/${userId}/playlists`;
    response = await fetch(savePlaylistURL, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: playlistName }),
    });

    if (!response.ok) throw new Error(response.statusText);

    jsonResponse = await response.json();
    const playlistId = jsonResponse.id;
    //====================================================================================
    const addTrackURL = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
    response = await fetch(addTrackURL, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ uris: trackURIs }),
    });

    return response;
  },
};

export default Spotify;
