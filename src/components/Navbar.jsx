import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SearchIcon, 
  HeartIcon, 
  UserIcon, 
  PlusIcon, 
  ShieldCheckIcon, 
  BriefcaseIcon, 
  HelpCircleIcon, 
  LogOutIcon 
} from './Icons';
import ModalSupport from './ModalSupport';

export default function Navbar({ onSearch, currentSearch = '' }) {
  const { 
    isLoggedIn, 
    user, 
    isProvider, 
    isVerifiedProvider, 
    favorites, 
    logout 
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [showSupport, setShowSupport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img 
                src="/images/Logo.jpg" 
                alt="Conecta Serviços" 
                className="w-10 h-10 rounded-xl object-cover shadow-xs border border-blue-100 group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col">
                <div className="text-xl font-black tracking-tight leading-none">
                  <span className="text-[#001f65]">Conecta</span>
                  <span className="text-[#001f65]">Serviços</span>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Qual serviço você procura hoje? (ex: Eletricista, Limpeza, Aulas...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5  hover:bg-slate-100/70 focus:bg-white text-sm rounded-full border border-slate-300 focus:border-[#001f65] focus:ring-2 focus:ring-[#0cc0df]/20 transition-all outline-hidden text-slate-800 placeholder-slate-600"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <SearchIcon className="w-5 h-5" />
                </div>
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#001f65] hover:bg-[#002f99] text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Right Nav Actions */}
            <div className="flex items-center gap-3">
              
              {/* Suporte Button */}
              <button
                type="button"
                onClick={() => setShowSupport(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-[#001f65] hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Fale com nosso suporte"
              >
                <HelpCircleIcon className="w-4 h-4" />
                <span>Suporte</span>
              </button>

              {/* Favoritos / Interesses */}
              <Link
                to="/perfil?tab=favoritos"
                className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                title="Serviços Salvos (Interesses)"
              >
                <HeartIcon className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* If Logged in as Provider: Shortcut to New Service */}
              {isProvider && (
                <Link
                  to="/servicos/novo"
                  className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full shadow-xs transition-all ${
                    isVerifiedProvider 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                  title={isVerifiedProvider ? "Cadastrar Novo Serviço" : "Prestador aguardando verificação"}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Novo Serviço</span>
                </Link>
              )}

              {/* Auth Controls */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 border border-slate-200 hover:border-slate-300 rounded-full hover:shadow-xs transition-all bg-white cursor-pointer"
                  >
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {user?.name?.split(' ')[0] || 'Usuário'}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#001f65] to-[#0cc0df] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user?.name ? user.name[0] : 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100 /50">
                        <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        {isProvider && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheckIcon className="w-3 h-3" />
                            {isVerifiedProvider ? 'Prestador Verificado' : 'Registro Pendente'}
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/perfil?tab=dados"
                          className="flex items-center gap-2.5 px-4 py-2 text-[#001f65] hover: hover:text-[#001f65]"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>Meu Perfil</span>
                        </Link>
                        <Link
                          to="/perfil?tab=contratos"
                          className="flex items-center gap-2.5 px-4 py-2 text-[#001f65] hover: hover:text-[#001f65]"
                        >
                          <BriefcaseIcon className="w-4 h-4 text-slate-400" />
                          <span>Serviços Contratados</span>
                        </Link>
                        <Link
                          to="/perfil?tab=favoritos"
                          className="flex items-center gap-2.5 px-4 py-2 text-[#001f65] hover: hover:text-[#001f65]"
                        >
                          <HeartIcon className="w-4 h-4 text-slate-400" />
                          <span>Meus Interesses ({favorites.length})</span>
                        </Link>

                        {isProvider ? (
                          <>
                            <div className="my-1 border-t border-slate-100"></div>
                            <Link
                              to="/perfil?tab=prestador"
                              className="flex items-center gap-2.5 px-4 py-2 text-emerald-700 hover:bg-emerald-50 font-medium"
                            >
                              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                              <span>Painel do Prestador & Portfólio</span>
                            </Link>
                            <Link
                              to="/servicos/novo"
                              className="flex items-center gap-2.5 px-4 py-2 text-[#001f65] hover:"
                            >
                              <PlusIcon className="w-4 h-4 text-slate-400" />
                              <span>Criar Novo Serviço</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/perfil?tab=prestador"
                            className="flex items-center gap-2.5 px-4 py-2 text-blue-700 hover:bg-blue-50 font-medium"
                          >
                            <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                            <span>Quero ser um Prestador</span>
                          </Link>
                        )}

                        <div className="my-1 border-t border-slate-100"></div>
                        <button
                          type="button"
                          onClick={() => setShowSupport(true)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-[#001f65] hover: text-left"
                        >
                          <HelpCircleIcon className="w-4 h-4 text-slate-400" />
                          <span>Suporte e Ajuda</span>
                        </button>
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left"
                        >
                          <LogOutIcon className="w-4 h-4 text-rose-500" />
                          <span>Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/entrar"
                    className="px-4 py-2 text-xs font-semibold text-[#001f65] hover:text-[#004dff] hover:bg-blue-50 rounded-full transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastrar"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#001f65] hover:bg-[#0034a8] rounded-full shadow-xs hover:shadow-md transition-all"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-20 py-2 bg-slate-100 text-sm rounded-full border border-slate-200 outline-hidden"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </div>
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#001f65] text-white text-xs font-medium rounded-full"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Modal de Suporte */}
      {showSupport && (
        <ModalSupport onClose={() => setShowSupport(false)} />
      )}
    </>
  );
}
