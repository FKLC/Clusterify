import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider"

export default function Navbar() {
  const auth = useContext(AuthContext);

  let loginBtn;
  if (auth.accessKey == null) {
    loginBtn = <button className="btn btn-primary" onClick={auth.login}>Login</button>
  }

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4">
        <a href="/" className="d-flex align-items-center me-auto link-body-emphasis text-decoration-none">
          <span className="fs-4">Clusterify</span>
        </a>

        {loginBtn}
      </header>
    </div>

  )
}

