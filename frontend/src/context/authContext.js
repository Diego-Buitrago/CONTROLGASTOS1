/* eslint-disable  */
import { createContext, useCallback, useMemo, useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const [isAutenticated, setIsAutenticated] = useState(true)

  useEffect(() => {
    fetch('api/verificarToken', {
      method: 'POST',
      headers: {'Authorization': `Bearer ${localStorage.getItem('tokenGastos')}`}
    }).then(async res => {
      const respuesta = await res.json();
      setIsAutenticated(respuesta);      
    });
  }, [])

  const Login = useCallback((user) => {
    window.localStorage.setItem("tokenGastos", user.token)
    window.localStorage.setItem("usuarioGastos", user.usunombre)
    setIsAutenticated(true);
    return <Navigate to="/" />
    
  }, []);

  const Logout = useCallback(() => {
    //window.localStorage.clear();
    window.localStorage.removeItem("tokenGastos", true);
    window.localStorage.removeItem("usuarioGastos", true);
    setIsAutenticated(false);
  }, []);

  const value = useMemo(() => ({
      Login,
      Logout,
      isAutenticated,
    }),
    [isAutenticated, Login, Logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}