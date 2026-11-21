import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModalReview from '../components/ModalReview';
import ModalSupport from '../components/ModalSupport';
import RatingStars from '../components/RatingStars';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useMask } from '@react-input/mask';
import { 
  UserIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  ClockIcon, 
  HelpCircleIcon,
  CheckCircleIcon,
  LogOutIcon
} from '../components/Icons';

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dados';

  const { 
    isLoggedIn, 
    user, 
    provider, 
    isProvider, 
    isVerifiedProvider, 
    updateUser, 
    registerAsProvider, 
    updateProviderProfile, 
    portfolio, 
    addPortfolioProject, 
    removePortfolioProject,
    favorites,
    logout 
  } = useAuth();

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/entrar');
    }
  }, [isLoggedIn, navigate]);

  // Tab 1: Personal Data state
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [msgDados, setMsgDados] = useState({ tipo: '', texto: '' });

  // Tab 2: Addresses state
  const [enderecos, setEnderecos] = useState(user?.addresses || []);
  const [novoCep, setNovoCep] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novaCidade, setNovaCidade] = useState('');
  const [novoEstado, setNovoEstado] = useState('');
  const [novaRua, setNovaRua] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const [novoComplemento, setNovoComplemento] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [msgEndereco, setMsgEndereco] = useState({ tipo: '', texto: '' });

  const cepMaskRef = useMask({
    mask: '__.___-___',
    replacement: { _: /\d/ }
  });

  // Tab 3: Contracts state
  const [contratos, setContratos] = useState([]);
  const [filtroContratos, setFiltroContratos] = useState('TODOS');
  const [contratoParaAvaliar, setContratoParaAvaliar] = useState(null);
  const [loadingContratos, setLoadingContratos] = useState(false);

  // Tab 4: Provider state
  const [especializacao, setEspecializacao] = useState(provider?.specialization || '');
  const [numRegistro, setNumRegistro] = useState(provider?.registrationNumber || '');
  const [meusServicos, setMeusServicos] = useState([]);
  const [msgPrestador, setMsgPrestador] = useState({ tipo: '', texto: '' });

  // Portfolio new project state
  const [projTitulo, setProjTitulo] = useState('');
  const [projCategoria, setProjCategoria] = useState('Geral');
  const [projDesc, setProjDesc] = useState('');
  const [projImagem, setProjImagem] = useState('');
  const [projData, setProjData] = useState('');

  // Tab 5: Favorites state
  const [favoritosLista, setFavoritosLista] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);

  // Modals
  const [showSupport, setShowSupport] = useState(false);

  // Load contracts and user data
  useEffect(() => {
    if (user) {
      setNome(user.name || '');
      setEmail(user.email || '');
      if (user.addresses) setEnderecos(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    if (provider) {
      setEspecializacao(provider.specialization || '');
      setNumRegistro(provider.registrationNumber || '');
    }
  }, [provider]);

  // Load contracts when switching to contracts tab
  useEffect(() => {
    if (currentTab === 'contratos') {
      setLoadingContratos(true);
      api.getMyContracts().then((data) => {
        setContratos(data || []);
        setLoadingContratos(false);
      });
    }
  }, [currentTab]);

  // Load provider services
  useEffect(() => {
    if (currentTab === 'prestador' && isProvider) {
      const provId = provider?.id || user?.providerId || user?.id;
      api.getServices({ idPrestador: String(provId) }).then((data) => {
        setMeusServicos(data || []);
      });
    }
  }, [currentTab, isProvider, provider, user]);

  // Load favorites
  useEffect(() => {
    if (currentTab === 'favoritos') {
      setLoadingFavoritos(true);
      api.getServices().then((allServices) => {
        const favs = allServices.filter(s => favorites.includes(s.id));
        setFavoritosLista(favs);
        setLoadingFavoritos(false);
      });
    }
  }, [currentTab, favorites]);

  // CEP Lookup for new address
  useEffect(() => {
    const raw = novoCep.replace(/\D/g, "");
    if (raw.length === 8) {
      setBuscandoCep(true);
      fetch(`https://viacep.com.br/ws/${raw}/json/`)
        .then(r => r.json())
        .then(d => {
          if (!d.erro) {
            setNovoBairro(d.bairro || '');
            setNovaCidade(d.localidade || '');
            setNovoEstado(d.uf || '');
            setNovaRua(d.logradouro || '');
          }
        })
        .finally(() => setBuscandoCep(false));
    }
  }, [novoCep]);

  // Handle Tab Change
  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  // Handlers
  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    setMsgDados({ tipo: '', texto: '' });
    const payload = { name: nome, email };
    if (novaSenha) payload.password = novaSenha;

    await updateUser(payload);
    setMsgDados({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso!' });
    setNovaSenha('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!novoCep || !novoNumero || !novaRua) {
      setMsgEndereco({ tipo: 'erro', texto: 'Preencha os campos obrigatórios do endereço.' });
      return;
    }

    const payload = {
      cep: novoCep.replace(/\D/g, ""),
      uf: novoEstado,
      municipio: novaCidade,
      bairro: novoBairro,
      logradouro: novaRua,
      numero: novoNumero,
      complemento: novoComplemento
    };

    const res = await api.addAddress(payload);
    if (res.success) {
      const updated = [...enderecos, res.data];
      setEnderecos(updated);
      updateUser({ addresses: updated });
      setMsgEndereco({ tipo: 'sucesso', texto: 'Novo endereço adicionado com sucesso!' });
      setNovoCep('');
      setNovoBairro('');
      setNovaCidade('');
      setNovoEstado('');
      setNovaRua('');
      setNovoNumero('');
      setNovoComplemento('');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (enderecos.length <= 1) {
      alert('Todo usuário deve manter ao menos um endereço cadastrado.');
      return;
    }
    if (window.confirm('Tem certeza que deseja remover este endereço?')) {
      await api.deleteAddress(id);
      const updated = enderecos.filter(a => a.id !== id);
      setEnderecos(updated);
      updateUser({ addresses: updated });
    }
  };

  const handleBecomeProvider = async (e) => {
    e.preventDefault();
    if (!especializacao.trim()) {
      setMsgPrestador({ tipo: 'erro', texto: 'Informe sua especialização profissional.' });
      return;
    }

    const res = await registerAsProvider(especializacao.trim(), numRegistro.trim());
    if (res.success) {
      setMsgPrestador({ 
        tipo: 'sucesso', 
        texto: 'Perfil de prestador criado com sucesso! Agora você pode gerenciar serviços e portfólio.' 
      });
    } else {
      setMsgPrestador({ tipo: 'erro', texto: res.error || 'Erro ao registrar prestador.' });
    }
  };

  const handleUpdateProvider = async (e) => {
    e.preventDefault();
    const res = await updateProviderProfile(especializacao, numRegistro);
    if (res.success) {
      setMsgPrestador({ tipo: 'sucesso', texto: 'Perfil profissional atualizado com sucesso!' });
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projTitulo.trim()) return;

    addPortfolioProject({
      titulo: projTitulo.trim(),
      categoria: projCategoria,
      descricao: projDesc.trim(),
      imagem: projImagem.trim() || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      dataConclusao: projData || new Date().toISOString().split('T')[0]
    });

    setProjTitulo('');
    setProjDesc('');
    setProjImagem('');
    setProjData('');
  };

  const handleCancelContract = async (id) => {
    const motivo = prompt('Informe o motivo do cancelamento:') || 'Cancelado pelo cliente';
    const res = await api.cancelContract(id, motivo);
    if (res.success) {
      setContratos(prev => prev.map(c => c.id === id ? { ...c, status: 'CANCELADO', motivoCancelamento: motivo } : c));
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Deseja realmente excluir este serviço do catálogo?')) {
      await api.deleteService(id);
      setMeusServicos(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#001f65] via-[#0034a8] to-[#0cc0df] text-white flex items-center justify-center font-black text-2xl uppercase shadow-md">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {user?.name || "Meu Perfil"}
                </h1>
                {isVerifiedProvider ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Prestador Verificado
                  </span>
                ) : isProvider ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <span>⏳</span> Prestador em Análise
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#001f65] border border-blue-200">
                    Cliente Cadastrado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              {isProvider && provider?.specialization && (
                <p className="text-xs font-semibold text-[#001f65] mt-1">
                  Especialidade: {provider.specialization}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={() => setShowSupport(true)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircleIcon className="w-4 h-4 text-[#0cc0df]" />
              <span>Suporte</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 scrollbar-none">
          <button
            type="button"
            onClick={() => setTab('dados')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'dados'
                ? 'bg-[#001f65] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Dados & Senha</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('enderecos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'enderecos'
                ? 'bg-[#001f65] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPinIcon className="w-4 h-4" />
            <span>Meus Endereços ({enderecos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('contratos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'contratos'
                ? 'bg-[#001f65] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BriefcaseIcon className="w-4 h-4" />
            <span>Serviços Contratados</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('prestador')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'prestador'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>{isProvider ? 'Painel do Prestador & Portfólio' : 'Quero ser Prestador'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('favoritos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'favoritos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <HeartIcon className="w-4 h-4" />
            <span>Meus Interesses ({favorites.length})</span>
          </button>
        </div>

        {/* Tab 1: Dados Pessoais & Senha */}
        {currentTab === 'dados' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Informações Cadastrais</h2>
            <p className="text-xs text-slate-500 mb-6">Atualize seu nome, email e senha de acesso</p>

            {msgDados.texto && (
              <div className={`mb-4 p-3 rounded-2xl text-xs font-medium ${
                msgDados.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {msgDados.texto}
              </div>
            )}

            <form onSubmit={handleUpdateUserData} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    CPF (Não alterável)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.cpf || '000.000.000-00'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.birthday || '1995-01-01'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nova Senha (Deixe em branco para manter a atual)
                </label>
                <input
                  type="password"
                  placeholder="Digite sua nova senha se desejar alterar"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#001f65] hover:bg-[#0034a8] text-white text-xs font-bold rounded-full shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Meus Endereços */}
        {currentTab === 'enderecos' && (
          <div className="space-y-6 max-w-4xl">
            {/* Lista de Endereços */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Endereços Cadastrados</h2>
              <p className="text-xs text-slate-500 mb-4">
                Todo usuário deve ter ao menos um endereço para receber serviços em domicílio.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enderecos.map((end, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#001f65] mb-1">
                        <MapPinIcon className="w-4 h-4 text-[#0cc0df]" />
                        <span>Endereço {idx === 0 ? '(Principal)' : `#${idx + 1}`}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-semibold">
                        {end.logradouro}, {end.numero}
                        {end.complemento ? ` (${end.complemento})` : ''}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {end.bairro} - {end.municipio}/{end.uf}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">CEP: {end.cep}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(end.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adicionar Novo Endereço */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Adicionar Novo Endereço</h3>
              <p className="text-xs text-slate-500 mb-4">Preencha o CEP para carregar o endereço automaticamente</p>

              {msgEndereco.texto && (
                <div className={`mb-4 p-3 rounded-2xl text-xs font-medium ${
                  msgEndereco.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {msgEndereco.texto}
                </div>
              )}

              <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">CEP *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      ref={cepMaskRef}
                      placeholder="00.000-000"
                      value={novoCep}
                      onChange={(e) => setNovoCep(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                    />
                    {buscandoCep && (
                      <span className="absolute right-2 top-2 text-[10px] text-blue-600 font-bold">Buscando...</span>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bairro"
                    value={novoBairro}
                    onChange={(e) => setNovoBairro(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={novaCidade}
                    onChange={(e) => setNovaCidade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="SP"
                    value={novoEstado}
                    onChange={(e) => setNovoEstado(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 uppercase"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rua / Logradouro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rua ou Avenida"
                    value={novaRua}
                    onChange={(e) => setNovaRua(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={novoNumero}
                    onChange={(e) => setNovoNumero(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    placeholder="Ex: Bloco B, Apto 402"
                    value={novoComplemento}
                    onChange={(e) => setNovoComplemento(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                <div className="sm:col-span-6 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#001f65] hover:bg-[#0034a8] text-white text-xs font-bold rounded-full shadow-md cursor-pointer"
                  >
                    Salvar Endereço
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Meus Serviços Contratados (Pedidos) */}
        {currentTab === 'contratos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Serviços Contratados</h2>
                <p className="text-xs text-slate-500">
                  Acompanhe seus agendamentos ativos, histórico e avalie os profissionais
                </p>
              </div>

              {/* Filtro status */}
              <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1">
                {['TODOS', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFiltroContratos(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      filtroContratos === st ? 'bg-[#001f65] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'TODOS' ? 'Todos' : st === 'EM_ANDAMENTO' ? 'Ativos' : st === 'CONCLUIDO' ? 'Concluídos' : 'Cancelados'}
                  </button>
                ))}
              </div>
            </div>

            {loadingContratos ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Carregando seus contratos...
              </div>
            ) : contratos.length > 0 ? (
              <div className="space-y-4">
                {contratos
                  .filter(c => filtroContratos === 'TODOS' || c.status === filtroContratos)
                  .map((contrato) => (
                    <div 
                      key={contrato.id} 
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            contrato.status === 'CONCLUIDO' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : contrato.status === 'CANCELADO'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {contrato.status === 'CONCLUIDO' ? '✓ Concluído' : contrato.status === 'CANCELADO' ? 'Cancelado' : '⏳ Em Andamento'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Contrato #{contrato.id}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {contrato.servicoNome || "Serviço Contratado"}
                        </h3>

                        <p className="text-xs text-slate-500">
                          Prestador: <strong className="text-slate-700">{contrato.prestadorNome || "Profissional"}</strong>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 text-[#0cc0df]" />
                            {contrato.agendamento?.diaSemana} ({contrato.agendamento?.horario})
                          </span>
                          <span className="font-bold text-[#001f65]">
                            R$ {Number(contrato.valor || 0).toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Avaliação já feita */}
                        {contrato.avaliado && contrato.avaliacao && (
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-bold text-slate-700">Sua Avaliação:</span>
                              <RatingStars rating={contrato.avaliacao.nota} size="w-3 h-3" showNumber={true} />
                            </div>
                            <p className="text-slate-600 italic">"{contrato.avaliacao.comentario}"</p>
                          </div>
                        )}
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
                        {/* Se não avaliado e não cancelado -> Botão de Avaliar */}
                        {!contrato.avaliado && contrato.status !== 'CANCELADO' && (
                          <button
                            type="button"
                            onClick={() => setContratoParaAvaliar(contrato)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <span>⭐</span>
                            <span>Avaliar Serviço</span>
                          </button>
                        )}

                        {/* Cancelar contrato ativo */}
                        {contrato.status === 'EM_ANDAMENTO' && (
                          <button
                            type="button"
                            onClick={() => handleCancelContract(contrato.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}

                        <Link
                          to={`/servico/${contrato.idServico}`}
                          className="px-3.5 py-2 text-xs font-semibold text-[#001f65] hover:bg-blue-50 rounded-full transition-colors"
                        >
                          Ver Serviço
                        </Link>
                      </div>

                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <BriefcaseIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Nenhum serviço contratado ainda</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Explore nossos serviços e contrate profissionais qualificados com facilidade.
                </p>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-[#001f65] text-white text-xs font-bold rounded-full hover:bg-[#0034a8]"
                >
                  Explorar Serviços
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Área do Prestador & Portfólio */}
        {currentTab === 'prestador' && (
          <div className="space-y-8">
            
            {!isProvider ? (
              /* Formulário para se tornar Prestador */
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                    <ShieldCheckIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Seja um Prestador no Conecta Serviços</h2>
                    <p className="text-xs text-slate-500">Comece a oferecer seus serviços e conquiste clientes</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Como prestador, você poderá cadastrar seus serviços, definir preços e horários, construir seu portfólio profissional com fotos dos seus trabalhos e receber avaliações com nota média visível para seus clientes.
                </p>

                {msgPrestador.texto && (
                  <div className={`mb-4 p-3 rounded-2xl text-xs font-medium ${
                    msgPrestador.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {msgPrestador.texto}
                  </div>
                )}

                <form onSubmit={handleBecomeProvider} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Especialização Profissional *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Eletricista Predial, Faxina e Higienização, Designer..."
                      value={especializacao}
                      onChange={(e) => setEspecializacao(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Número de Registro Profissional (CFT, CREA, MEI ou CNPJ)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: REG-492019-SP"
                      value={numRegistro}
                      onChange={(e) => setNumRegistro(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-md cursor-pointer"
                    >
                      Cadastrar Perfil de Prestador
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Painel do Prestador Ativo */
              <div className="space-y-8">
                
                {/* Status & Perfil Profissional */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-[#0cc0df]">
                        Credencial de Prestador
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                        {provider?.specialization || "Especialista"}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Registro: <strong>{provider?.registrationNumber || "Não informado"}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${
                        isVerifiedProvider 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold">
                            {isVerifiedProvider ? 'Status: Verificado' : 'Status: Em Análise'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {isVerifiedProvider ? 'Habilitado para publicar serviços' : 'Verificação obrigatória'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edição de Especialização */}
                  <form onSubmit={handleUpdateProvider} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Especialização Profissional
                      </label>
                      <input
                        type="text"
                        value={especializacao}
                        onChange={(e) => setEspecializacao(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Registro / Certificação
                      </label>
                      <input
                        type="text"
                        value={numRegistro}
                        onChange={(e) => setNumRegistro(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#001f65] hover:bg-[#0034a8] text-white text-xs font-bold rounded-full cursor-pointer shadow-xs"
                      >
                        Salvar Informações Profissionais
                      </button>
                    </div>
                  </form>
                </div>

                {/* Meus Serviços Cadastrados */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Meus Serviços Cadastrados</h3>
                      <p className="text-xs text-slate-500">Serviços que você oferece aos clientes</p>
                    </div>
                    <Link
                      to="/servicos/novo"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Cadastrar Novo Serviço</span>
                    </Link>
                  </div>

                  {meusServicos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {meusServicos.map((srv) => (
                        <div key={srv.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                          <div>
                            <div className="aspect-16/9 rounded-xl overflow-hidden mb-2 bg-slate-200">
                              <img
                                src={srv.imagens?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'}
                                alt={srv.nome}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{srv.nome}</h4>
                            <p className="text-xs font-black text-[#001f65] mt-0.5">
                              R$ {Number(srv.preco || 0).toFixed(2).replace('.', ',')}
                            </p>
                          </div>

                          <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                            <Link to={`/servico/${srv.id}`} className="font-semibold text-blue-600 hover:underline">
                              Ver no Site
                            </Link>
                            <div className="flex items-center gap-2">
                              <Link to={`/servicos/editar/${srv.id}`} className="p-1 text-slate-600 hover:text-[#001f65]">
                                <EditIcon className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(srv.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <p className="text-xs text-slate-500 mb-3">Você ainda não tem serviços cadastrados.</p>
                      <Link
                        to="/servicos/novo"
                        className="px-4 py-2 bg-[#001f65] text-white text-xs font-bold rounded-full"
                      >
                        Criar Primeiro Serviço
                      </Link>
                    </div>
                  )}
                </div>

                {/* Construtor de Portfólio */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="mb-6">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#0cc0df]">
                      Vitrine de Trabalhos
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Meu Portfólio Profissional</h3>
                    <p className="text-xs text-slate-500">
                      Construa seu portfólio adicionando fotos e descrições de projetos anteriores para atrair mais clientes
                    </p>
                  </div>

                  {/* Formulário para Adicionar Projeto */}
                  <form onSubmit={handleAddProject} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-8 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <PlusIcon className="w-4 h-4 text-[#0cc0df]" />
                      Adicionar Novo Projeto ao Portfólio
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Título do Projeto *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Reforma Elétrica em Apartamento Residencial"
                          value={projTitulo}
                          onChange={(e) => setProjTitulo(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Categoria / Tag</label>
                        <input
                          type="text"
                          placeholder="Ex: Elétrica, Iluminação"
                          value={projCategoria}
                          onChange={(e) => setProjCategoria(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">URL da Foto do Trabalho</label>
                        <input
                          type="url"
                          placeholder="https://exemplo.com/foto-obra.jpg"
                          value={projImagem}
                          onChange={(e) => setProjImagem(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Data de Conclusão</label>
                        <input
                          type="date"
                          value={projData}
                          onChange={(e) => setProjData(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Descrição do Trabalho Realizado</label>
                        <textarea
                          rows={2}
                          placeholder="Descreva os desafios do projeto, técnicas e materiais utilizados..."
                          value={projDesc}
                          onChange={(e) => setProjDesc(e.target.value)}
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
                      >
                        + Inserir no Portfólio
                      </button>
                    </div>
                  </form>

                  {/* Galeria de Projetos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.map((proj) => (
                      <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <div className="aspect-4/3 w-full bg-slate-100 relative">
                            <img
                              src={proj.imagem}
                              alt={proj.titulo}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";
                              }}
                            />
                            {proj.categoria && (
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                                {proj.categoria}
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm text-slate-900 mb-1">{proj.titulo}</h4>
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{proj.descricao}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400">
                          <span>{proj.dataConclusao || 'Recente'}</span>
                          <button
                            type="button"
                            onClick={() => removePortfolioProject(proj.id)}
                            className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* Tab 5: Meus Interesses (Favoritos) */}
        {currentTab === 'favoritos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Meus Interesses Salvos</h2>
              <p className="text-xs text-slate-500">Serviços que você favoritou para consultar ou contratar depois</p>
            </div>

            {loadingFavoritos ? (
              <div className="py-12 text-center text-xs text-slate-500">Carregando interesses...</div>
            ) : favoritosLista.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritosLista.map((serv) => (
                  <ServiceCard key={serv.id} service={serv} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <HeartIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Você ainda não salvou nenhum serviço</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Clique no ícone de coração nos cards de serviços para salvá-los aqui.
                </p>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-[#001f65] text-white text-xs font-bold rounded-full hover:bg-[#0034a8]"
                >
                  Ver Serviços Disponíveis
                </Link>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal de Avaliação */}
      {contratoParaAvaliar && (
        <ModalReview
          contract={contratoParaAvaliar}
          onClose={() => setContratoParaAvaliar(null)}
          onReviewed={(rev) => {
            setContratos(prev => prev.map(c => c.id === contratoParaAvaliar.id ? { ...c, avaliado: true, avaliacao: rev } : c));
            setContratoParaAvaliar(null);
          }}
        />
      )}

      {/* Modal de Suporte */}
      {showSupport && (
        <ModalSupport onClose={() => setShowSupport(false)} />
      )}

      <Footer />
    </div>
  );
}
