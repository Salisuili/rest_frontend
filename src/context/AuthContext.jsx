// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/auth'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const userProfile = await getProfile();
          setUser(userProfile);
          setIsAdmin(userProfile.role === 'admin'); 
          console.log("User re-hydrated from profile API:", userProfile.email);
        } catch (error) {
          console.error('Failed to re-hydrate user from profile API. Clearing session:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAdmin(false); 
        }
      }
      setLoading(false);
    };

    loadInitialAuth(); 

  }, []); 


  const login = async (credentials) => { 
    setLoading(true); 
    try {
      const result = await apiLogin(credentials); 
      
      setUser(result.user); 
      setIsAdmin(result.user.role === 'admin'); 
      
      navigate('/');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true); 
    try {
      const result = await apiRegister(userData); 
      
      setUser(result.user); 
      setIsAdmin(result.user.role === 'admin'); 
      
      navigate('/');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext Register failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false); 
    }
  };

  const logout = async () => {    
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false); 
    navigate('/login');
  };

  const isAuthenticated = !!user; 

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated, 
        isAdmin,         
        login,
        register,
        logout,
        loading
      }}
    >
      {loading ? <div>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);