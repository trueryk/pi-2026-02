import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import ServiceDetails from './pages/ServiceDetails';
import ServiceForm from './pages/ServiceForm';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/servico/:id" element={<ServiceDetails />} />
        <Route path="/servicos/novo" element={<ServiceForm />} />
        <Route path="/servicos/editar/:id" element={<ServiceForm />} />
        <Route path="/perfil" element={<Profile />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
