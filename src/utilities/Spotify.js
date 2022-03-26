const CLIENT_ID = "a4352f8e8f8f41dbaa35d72686e756c1";
const REDIRECT_URI = "http://localhost:3000/callback"; //must have trailing slash
const SPOTIFY_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-public"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (hasAccessToken && hasExpiresIn) {
      accessToken = hasAccessToken[1];
      const expiresIn = Number(hasExpiresIn[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      return accessToken;
    } else {
      const accessUrl = `${SPOTIFY_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPES_URL_PARAM}&redirect_uri=${REDIRECT_URI}`;
      window.location = accessUrl;
    }
  },
  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    if (!accessToken) {
      accessToken = Spotify.getAccessToken();
    }

    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer  ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }

        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      })
      .catch((error) => console.log("error in search:" + error.message));
  },
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    if (!accessToken) {
      accessToken = Spotify.getAccessToken();
    }

    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        userId = response.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: playlistName }),
        });
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackURIs }),
          }
        );
      });
  },
};

export default Spotify;
