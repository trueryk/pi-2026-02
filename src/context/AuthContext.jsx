import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('conecta_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('conecta_provider');
    return saved ? JSON.parse(saved) : null;
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('conecta_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('conecta_portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('conecta_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync portfolio with localStorage
  useEffect(() => {
    localStorage.setItem('conecta_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Carrega autenticação real ao inicializar
  useEffect(() => {
    async function initAuth() {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        const me = await api.getMe();
        if (me) {
          setUser(me);
          localStorage.setItem('conecta_user', JSON.stringify(me));
          if (me.providerId) {
            const prov = await api.getProvider();
            if (prov) {
              setProvider(prov);
              localStorage.setItem('conecta_provider', JSON.stringify(prov));
            }
          }
        } else {
          // Token expirado ou inválido
          setToken('');
          setTokenState('');
          setUser(null);
          setProvider(null);
          localStorage.removeItem('conecta_user');
          localStorage.removeItem('conecta_provider');
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (newToken) => {
    setToken(newToken);
    setTokenState(newToken);

    const me = await api.getMe();
    if (me) {
      setUser(me);
      localStorage.setItem('conecta_user', JSON.stringify(me));

      if (me.providerId) {
        const prov = await api.getProvider();
        if (prov) {
          setProvider(prov);
          localStorage.setItem('conecta_provider', JSON.stringify(prov));
        }
      } else {
        setProvider(null);
        localStorage.removeItem('conecta_provider');
      }
    }
  };

  const logout = () => {
    setToken('');
    setTokenState('');
    setUser(null);
    setProvider(null);
    localStorage.removeItem('conecta_user');
    localStorage.removeItem('conecta_provider');
  };

  const updateUser = async (data) => {
    const res = await api.updateMe(data);
    if (res.success) {
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem('conecta_user', JSON.stringify(updated));
      return { success: true };
    }
    return res;
  };

  const registerAsProvider = async (specialization, registrationNumber) => {
    const res = await api.registerProvider({ specialization, registrationNumber });
    if (res.success) {
      setProvider(res.data);
      localStorage.setItem('conecta_provider', JSON.stringify(res.data));
      if (user) {
        const updatedUser = { ...user, providerId: res.data.id };
        setUser(updatedUser);
        localStorage.setItem('conecta_user', JSON.stringify(updatedUser));
      }
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const updateProviderProfile = async (specialization, registrationNumber) => {
    const res = await api.updateProvider({ specialization, registrationNumber });
    if (res.success) {
      const updated = { ...provider, ...res.data };
      setProvider(updated);
      localStorage.setItem('conecta_provider', JSON.stringify(updated));
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const toggleFavorite = (serviceId) => {
    setFavorites(prev => {
      const exists = prev.includes(serviceId);
      if (exists) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const isFavorite = (serviceId) => {
    return favorites.includes(serviceId);
  };

  const addPortfolioProject = (project) => {
    const newProj = { id: "proj-" + Date.now(), ...project };
    setPortfolio(prev => [newProj, ...prev]);
  };

  const removePortfolioProject = (id) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const isLoggedIn = !!token && !!user;
  const isProvider = !!(provider || (user && user.providerId));
  const isVerifiedProvider = isProvider && (provider?.verified === true);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        provider,
        portfolio,
        favorites,
        loading,
        isLoggedIn,
        isProvider,
        isVerifiedProvider,
        login,
        logout,
        updateUser,
        registerAsProvider,
        updateProviderProfile,
        toggleFavorite,
        isFavorite,
        addPortfolioProject,
        removePortfolioProject
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
