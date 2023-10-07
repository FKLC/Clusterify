import { useContext } from "react";
import { APIContext } from "../providers/APIProvider";


export default function CreatedPlaylists({ playlists, filterKeys }) {
  const api = useContext(APIContext);

  const createPlaylist = async (tracks) => {
    const id = await api.spotify.createPlaylist("Clusterify Playlist");
    const uris = tracks.map((track) => track.id);
    await api.spotify.addTracksToPlaylist(id, uris);
  }

  const playlistStats = (tracks) => {
    const stats = tracks.reduce((acc, [track, features]) => {
      for (const key in features) {
        if (!filterKeys.includes(key)) {
          continue;
        }
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(features[key]);
      }
      return acc;
    }, {});

    for (const key in stats) {
      stats[key] = stats[key].reduce((acc, val) => acc + val, 0) / stats[key].length;
    }

    return stats;
  }

  const normalizeName = (name) => name
    .replace(/_/g, " ")
    .replace(/ms$/, "");
  
  const playlistStatsString = (tracks) => {
    const stats = playlistStats(tracks);
    return Object.entries(stats).map(([key, value]) => {
      return `${normalizeName(key)}: ${value.toFixed(2)}`;
    }).join(", ");
  }

  return (
    <>
      {
        playlists.map((tracks) => (
          <div key={JSON.stringify(tracks)} className="d-grid gap-3">
            <button className="btn btn-primary" onClick={() => createPlaylist(tracks)}>Create Playlist</button>
            <div className="list-group overflow-auto" style={{ maxHeight: 650 }}>
            <li className="list-group-item active" style={{ textTransform: "capitalize" }}>{ playlistStatsString(tracks) }</li>
              {
                tracks.map(([track], i) => (
                  <li
                    className="list-group-item list-group-item-action d-flex gap-3 py-3"
                    key={track.id + i}
                  >
                    <img src={track.image} alt="Album Cover" width="32" height="32" className="flex-shrink-0" />
                    <h6 className="mb-0">{track.name}</h6>
                  </li>
                ))
              }
            </div>
            <br/>
          </div>
        ))
      }
    </>
  )
}