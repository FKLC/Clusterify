import { useContext, useEffect, useState } from "react";
import { APIContext } from "../providers/APIProvider";
import spotifyIcon from "../assets/spotify.svg"

export default function PlaylistPicker({ onSelect }) {
  const [playlists, setPlaylists] = useState([
    { name: "Loading playlists...", id: 0, images: [{ url: spotifyIcon }] }
  ]);
  const api = useContext(APIContext);

  useEffect(() => {
    if (api.spotify) {
      api.spotify.fetchPlaylists().then(playlists => {
        setPlaylists(playlists);
      });
    }
  }, [api.spotify]);


  const [link, setLink] = useState("");
  const parseLink = (link) => {
    let match = link.match(/playlist\/(\w+)/);
    if (match) {
      return match[1];
    }

    match = link.match(/link\/(\w+)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  const loadPlaylist = () => {
    const playlistId = parseLink(link);
    if (playlistId) {
      onSelect(playlistId);
    }
    else {
      alert("Invalid playlist link");
    }
  }

  return (
    <>
      <h4>Playlists</h4>
      <form className="input-group mb-3">
        <input
          type="url" className="form-control"
          placeholder="Paste playlist share link"
          onChange={(e) => setLink(e.target.value)}
          value={link}
        />
        <button
          className="btn btn-secondary" type="button"
          onClick={loadPlaylist}
        >Load Playlist</button>
      </form>
      <div className="list-group overflow-auto" style={{ maxHeight: 800 }}>
        {
          playlists.map(playlist => (
            <li
              className="list-group-item list-group-item-action d-flex gap-3 py-3"
              onClick={() => onSelect(playlist.id)}
              key={playlist.id}
            >
              <img src={playlist.images.slice(-1)[0].url} alt="Playlist Cover" width="32" height="32" className="flex-shrink-0" />
              <h6 className="mb-0 text-truncate">{playlist.name}</h6>
            </li>
          ))
        }
      </div>
    </>
  )
}