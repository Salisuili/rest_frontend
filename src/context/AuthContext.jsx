// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import supabase from '../config/supabase'; // Consider removing if not primarily using Supabase Auth
import { login as apiLogin, register as apiRegister, getProfile } from '../api/auth'; // Ensure getProfile is imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // <--- NEW: State to track admin status
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          // Attempt to fetch profile using the stored token
          const userProfile = await getProfile(); // This call uses the stored token implicitly via axios headers
          setUser(userProfile);
          setIsAdmin(userProfile.role === 'admin'); // <--- Set isAdmin based on fetched role
          console.log("User re-hydrated from profile API:", userProfile.email);
        } catch (error) {
          console.error('Failed to re-hydrate user from profile API. Clearing session:', error);
          // If profile fetch fails (e.g., 401 Unauthorized), clear stored data
          localStorage.removeItem('token');
          setUser(null);
          setIsAdmin(false); // <--- Reset isAdmin
        }
      }
      setLoading(false);
    };

    loadInitialAuth(); // Call it once on mount

    // REMOVED: supabase.auth.onAuthStateChange listener
    // This listener is typically for Supabase's own auth system.
    // Since you're using a custom backend for primary auth, this can be removed
    // to avoid potential conflicts or unnecessary re-renders.
    // If you explicitly use supabase.auth.signInWithPassword elsewhere,
    // you might need to re-evaluate how to sync.
    // For this setup, we rely on our custom backend's JWT and getProfile.

    // return () => subscription.unsubscribe(); // No subscription to unsubscribe from
  }, []); // Empty dependency array ensures it runs once on mount


  const login = async (credentials) => { // Expects an object { email, password }
    setLoading(true); // Start loading during login
    try {
      const result = await apiLogin(credentials); // This sets the token in localStorage via apiLogin
      
      setUser(result.user); // Set the full user object including role
      setIsAdmin(result.user.role === 'admin'); // <--- Set isAdmin
      
      navigate('/');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false); // End loading
    }
  };

  const register = async (userData) => {
    setLoading(true); // Start loading during register
    try {
      const result = await apiRegister(userData); // This sets the token in localStorage via apiRegister
      
      setUser(result.user); // Set the full user object including role
      setIsAdmin(result.user.role === 'admin'); // <--- Set isAdmin
      
      navigate('/');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext Register failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false); // End loading
    }
  };

  const logout = async () => {
    // If you're solely relying on your custom backend, `supabase.auth.signOut()` might be unnecessary
    // unless you also use Supabase for row-level security with its auth.
    // If you only use custom backend auth, remove this:
    // await supabase.auth.signOut();
    
    localStorage.removeItem('token');
    // localStorage.removeItem('user'); // No longer storing 'user' in localStorage
    setUser(null);
    setIsAdmin(false); // <--- Reset isAdmin on logout
    navigate('/login');
  };

  const isAuthenticated = !!user; // Derived state

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated, // Expose isAuthenticated
        isAdmin,         // <--- Expose isAdmin
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