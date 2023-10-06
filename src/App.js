import { useContext, useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import AccordionItem from './components/AccordionItem';
import ClusterOptions from './components/ClusterOptions';
import FilterChoices from './components/FilterChoices';
import PlaylistPicker from './components/PlaylistPicker';
import PlaylistPreview from './components/PlaylistPreview';

import { AuthContext } from './providers/AuthProvider';
import { APIContext } from './providers/APIProvider';

import figue from './Figue.js';

import spotifyIcon from "./assets/spotify.svg";
import CreatedPlaylists from './components/CreatedPlaylists';

export default function App() {
  const auth = useContext(AuthContext);
  const api = useContext(APIContext);

  const [playlistId, setPlaylistId] = useState(null);
  const [filterKeys, setFilterKeys] = useState([]);
  const [createdPlaylists, setCreatedPlaylists] = useState([]);

  const [tracks, setTracks] = useState([
    { name: "Waiting for selection...", id: 0, image: spotifyIcon }
  ]);

  useEffect(() => {
    if (api.spotify && playlistId) {
      setTracks([
        { name: "Loading tracks...", id: 1, image: spotifyIcon }
      ]);
      api.spotify.fetchPlaylist(playlistId).then(setTracks);
    }
  }, [api.spotify, playlistId]);

  const cluster = async (count) => {
    const features = await api.spotify.fetchAudioFeatures(tracks.map((track) => track.id));
    const featureMatrix = features.map((feature) => {
      return filterKeys.map((key) => feature[key]);
    });
    
    for (let i = 0; i < featureMatrix[0].length; i++) {
      const min = Math.min(...featureMatrix.map((vector) => vector[i]));
      const max = Math.max(...featureMatrix.map((vector) => vector[i]));
      for (let j = 0; j < featureMatrix.length; j++) {
        featureMatrix[j][i] = (featureMatrix[j][i] - min) / (max - min);
      }
    }

    const clusters = figue.kmeans(count, featureMatrix).assignments;
    const clustersWithTracks = clusters.reduce((acc, cluster, index) => {
      if (!acc[cluster]) {
        acc[cluster] = [];
      }
      acc[cluster].push(tracks[index]);
      return acc;
    }, []);

    setCreatedPlaylists(clustersWithTracks);
  };

  const content = auth.accessKey == null ?
    <h2>Not logged in. Please login first to use the app.</h2>
    : <div className="accordion">
      <AccordionItem title="Select a playlist">
        <PlaylistPicker onSelect={setPlaylistId} />
      </AccordionItem>
      <AccordionItem title="Preview playlist tracks">
        <PlaylistPreview playlistId={playlistId} tracks={tracks} />
      </AccordionItem>
      <AccordionItem title="Select filters">
        <FilterChoices onSelect={setFilterKeys} />
      </AccordionItem>
      <AccordionItem title="Playlist count">
        <ClusterOptions onSubmit={cluster} />
      </AccordionItem>
      <AccordionItem title="Created Playlists">
        <CreatedPlaylists playlists={createdPlaylists} />
      </AccordionItem>
    </div>;

  return (
    <>
      <Navbar />
      <div className="container">
        {content}
      </div>
    </>
  )
}
