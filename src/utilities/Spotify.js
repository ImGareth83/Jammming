const CLIENT_ID = "a4352f8e8f8f41dbaa35d72686e756c1";
const REDIRECT_URI = "http://localhost:3000/callback"; //must have trailing slash
const SPOTIFY_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-public"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

let accessToken;

const Spotify = {
  authURL() {
    const accessUrl = `${SPOTIFY_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPES_URL_PARAM}&redirect_uri=${REDIRECT_URI}`;
    window.location = accessUrl;
  },
  getAccessToken() {
    accessToken = window.localStorage.getItem("accessToken");

    if (accessToken) return accessToken;

    const tokenHash = window.location.href.match(/access_token=([^&]*)/);
    const expiresInHash = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenHash && expiresInHash) {
      let token = tokenHash[1];
      accessToken = token;
      const expiresIn = Number(expiresInHash[1]);

      window.setTimeout(() => (token = ""), expiresIn * 1000);
      window.location.hash = "";
      window.localStorage.setItem("accessToken", token);
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
