import { createContext, useState } from "react"

const defaultContext = {
  accessKey: null,
  login: () => {
    const client_id = 'b91216751d87492aaf4ebe5c80b47202';
    const redirect_uri = window.location.href;
    const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public'

    const url = 'https://accounts.spotify.com/authorize'
      + '?response_type=token'
      + '&client_id=' + encodeURIComponent(client_id)
      + '&scope=' + encodeURIComponent(scope)
      + '&redirect_uri=' + encodeURIComponent(redirect_uri);

    window.location.href = url;
  },
};
export const AuthContext = createContext(defaultContext);

export default function AuthProvider({ children }) {
  const [context, setContext] = useState(defaultContext);

  const params = window.location.hash.slice(1).split("&").reduce((acc, param) => {
    const [key, value] = param.split("=");
    acc[key] = value;
    return acc;
  }, {});

  if (params.access_token && context.accessKey == null) {
    setContext({
      ...context,
      accessKey: "Bearer " + params.access_token,
    });
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}

