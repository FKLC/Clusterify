import { useContext } from "react";
import { APIContext } from "../providers/APIProvider";


export default function CreatedPlaylists({ playlists }) {
  const api = useContext(APIContext);

  const createPlaylist = async (tracks) => {
    const id = await api.spotify.createPlaylist("Clusterify Playlist");
    const uris = tracks.map((track) => track.id);
    await api.spotify.addTracksToPlaylist(id, uris);
  }

  return (
    <>
      {
        playlists.map(tracks => (
          <div key={JSON.stringify(tracks)} className="d-grid gap-3">
            <button className="btn btn-primary" onClick={() => createPlaylist(tracks)}>Create Playlist</button>
            <div className="list-group overflow-auto" style={{ maxHeight: 650 }}>
              {
                tracks.map((track, i) => (
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