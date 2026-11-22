import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocultar, setOcultar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    setErro('');

    const res = await api.login(email, senha);

    if (res.success) {
      await login(res.data.token);
      navigate(location.state?.from || '/');
    } else {
      setErro(res.error || 'Credenciais inválidas. Verifique seu email e senha.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f65] via-[#0034a8] to-[#0cc0df] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Dots */}
      <div className="absolute inset-0 dots-bg opacity-10 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Card Form */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          <div className="flex gap-4 justify-center items-center mb-[1rem]">
            <img
              src="/images/Logo.jpg"
              alt="Conecta Serviços"
              className="w-7 h-7 rounded shadow-lg group-hover:scale-105 transition-transform"
            />
            <h2 className="text-xl font-bold text-[#144975] tracking-tight">
              Entre na sua conta
            </h2>
          </div>
          {erro && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-bold tracking-wider text-[#144975] mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#001f65] focus:ring-2 focus:ring-[#0cc0df]/20 outline-hidden transition-all text-slate-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="senha" className="block font-bold tracking-wider text-[#144975]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setOcultar(!ocultar)}
                  className="text-xs text-[#144975] hover:text-blue-800 font-medium cursor-pointer"
                >
                  {ocultar ? "Mostrar senha" : "Ocultar senha"}
                </button>
              </div>
              <input
                id="senha"
                type={ocultar ? "password" : "text"}
                required
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#001f65] focus:ring-2 focus:ring-[#0cc0df]/20 outline-hidden transition-all text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#001f65] hover:bg-[#002f99] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Autenticando..." : "Entrar na Conta"}
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 text-center text-x text-slate-500">
            Não tem uma conta ainda?{' '}
            <Link to="/cadastrar" className="font-bold text-[#001f65] hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>

        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-white px-2 py-1 hover:text-[#001f65] rounded font-medium">
            <div className="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              Voltar para a Página Inicial
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
