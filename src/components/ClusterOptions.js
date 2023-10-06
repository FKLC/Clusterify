import { useState } from "react";

export default function ClusterOptions({ onSubmit }) {
  const [count, setCount] = useState("");

  return (
    <>
      <h4>Seperate Into</h4>
      <form className="input-group mb-3">
        <input
          type="number" className="form-control"
          placeholder="Seperate into how many playlists?"
          onChange={(e) => setCount(e.target.value)}
          value={count}
          min={2}
        />
        <button
          className="btn btn-secondary" type="button"
          onClick={() => onSubmit(+count)}
        >Seperate!</button>
      </form>
    </>
  )
}

