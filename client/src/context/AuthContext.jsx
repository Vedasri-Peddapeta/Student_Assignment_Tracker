import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        try {
          // verify token
          const config = { headers: { Authorization: `Bearer ${parsed.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
          setUser({ ...data, token: parsed.token });
        } catch (error) {
          console.error("Token verification failed", error);
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password, role) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      if (data.role === 'faculty') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      if (data.role === 'faculty') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
