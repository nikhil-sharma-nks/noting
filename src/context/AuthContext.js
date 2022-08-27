import { useContext, createContext, useEffect, useReducer } from 'react';
import { AuthReducer } from '../reducers';
const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(AuthReducer, {
    isAuth: false,
    token: '',
    user: {},
  });
  useEffect(() => {
    try {
      const localObj = {
        token: JSON.parse(localStorage.getItem('token')),
        user: JSON.parse(localStorage.getItem('user')),
        isAuth: JSON.parse(localStorage.getItem('isAuth')),
      };
      authDispatch({ type: 'LOGIN_USER', payload: localObj });
    } catch (err) {
      console.log(err.message);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
