import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userProfile = await getProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...userProfile
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const userProfile = await getProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...userProfile
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { user: authUser, error } = await apiLogin(email, password);
      if (error) throw error;
      
      const userProfile = await getProfile(authUser.id);
      setUser({
        id: authUser.id,
        email: authUser.email,
        ...userProfile
      });
      
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { user: authUser, error } = await apiRegister(userData);
      if (error) throw error;
      
      // Create user profile in your database
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          email: authUser.email,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber
        }]);
      
      if (profileError) throw profileError;
      
      setUser({
        id: authUser.id,
        email: authUser.email,
        full_name: userData.fullName
      });
      
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);