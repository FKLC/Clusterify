

export default function PlaylistPreview({ tracks }) {
  return (
    <>
      <h4>Tracks</h4>
      <div className="list-group">
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
    </>
  )
}