import { useState } from "react";

export default function FilterChoices({ onSelect }) {

  const options = {
    "acousticness": "Whether the track is acoustic",
    "danceability": "How danceable the track is",
    "duration_ms": "How long the track is",
    "energy": "How energetic the track is",
    "instrumentalness": "How instrumental the track is",
    "key": "The key of the track",
    "liveness": "How live the track is",
    "loudness": "How loud the track is",
    "mode": "The mode of the track",
    "speechiness": "The presence of spoken words in a track",
    "tempo": "The tempo of the track",
    "time_signature": "The time signature of the track",
    "valence": "Tracks with high valence sound more positive, and low valence tracks sound more negative"
  };

  const normalizeName = (name) => name
    .replace(/_/g, " ")
    .replace(/ms$/, "");

  const [selected, setSelect] = useState({});
  const select = (name) => {
    const newSelected = { ...selected, [name]: !selected[name] };
    setSelect(newSelected);
    onSelect(Object.keys(newSelected).filter((name) => newSelected[name]));
  };

  return (
    <>
      <h4>Seperate By</h4>
      <div className="list-group">
        {
          Object.entries(options).map(([name, description]) => (
            <label className="list-group-item d-flex gap-3" key={name}>
              <input className="form-check-input flex-shrink-0" type="checkbox" 
                onClick={() => select(name)} 
                value={selected[name]}
              />
              <span className="pt-1 form-checked-content">
                <strong style={{ textTransform: "capitalize" }}>{ normalizeName(name) }</strong>
                <small className="d-block text-body-secondary">
                  { description }
                </small>
              </span>
            </label>
          ))
        }
      </div>
    </>
  )
}

