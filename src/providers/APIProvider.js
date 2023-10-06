import { createContext, useContext, useState } from "react"
import { AuthContext } from "./AuthProvider";


const defaultContext = {
  spotify: null,
};
export const APIContext = createContext(defaultContext);

export default function APIProvider({ children }) {
  const auth = useContext(AuthContext);
  const [context, setContext] = useState(defaultContext);

  if (auth.accessKey && context.spotify == null) {
    setContext({
      ...context,
      spotify: new SpotifyAPI(auth.accessKey),
    });
  }

  return (
    <APIContext.Provider value={context}>
      {children}
    </APIContext.Provider>
  )
}

class SpotifyAPI {
  constructor(token) {
    this.token = token;
  }

  async fetchPlaylist(playlistId) {
    const tracks = [];
    let next = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(name,id,album(images))),next&limit=50`;

    while (true) {
      const resp = await fetch(next, { headers: { authorization: this.token } })
        .then((response) => response.json())

      tracks.push(...resp.items.map((item) => {
        return {
          id: item.track.id,
          name: item.track.name,
          image: item.track.album.images.pop().url
        }
      }));

      if (resp.next) {
        next = resp.next;
      } else {
        break;
      }
    }

    return tracks;
  }

  async fetchAudioFeatures(trackIds) {
    const features = [];
    const chunks = trackIds.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 100);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    let ids = [];
    while ((ids = chunks.pop())) {
      const next = `https://api.spotify.com/v1/audio-features?ids=` + ids.join(",");
      const resp = await fetch(next, { headers: { authorization: this.token } })
        .then((response) => response.json())

      resp.audio_features.forEach((feature) => {
        features.push(feature);
      });
    }

    return features;
  }

  async fetchPlaylists() {
    return fetch(
      "https://api.spotify.com/v1/me/playlists?limit=50",
      { headers: { authorization: this.token } }
    )
      .then((response) => response.json())
      .then((response) => response.items);
  }

  async getId() {
    return fetch(
      "https://api.spotify.com/v1/me",
      { headers: { authorization: this.token } }
    )
      .then((response) => response.json())
      .then((response) => response.id);
  }

  async createPlaylist(name) {
    const userId = await this.getId();

    return fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: { authorization: this.token },
        body: JSON.stringify({
          name,
          public: false
        }),
        method: "POST",
      },
    )
      .then((response) => response.json())
      .then((response) => response.id);
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    const chunks = trackIds.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 100);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    let ids = [];
    while ((ids = chunks.pop())) {
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { authorization: this.token },
          body: JSON.stringify({ uris: ids.map((id) => `spotify:track:${id}`) }),
          method: "POST",
        }
      ).then((response) => response.json())
    }
  }
}