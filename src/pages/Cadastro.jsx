import { useMask } from "@react-input/mask";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cpfValidator } from 'cpf-cnpj-validator';
import { api } from "../services/api";
import { ShieldCheckIcon, UserIcon } from "../components/Icons";

export default function Cadastro() {
  const cpfRef = useMask({
    mask: '___.___.___-__',
    replacement: { _: /\d/ }
  });

  const cepRef = useMask({
    mask: '__.___-___',
    replacement: { _: /\d/ }
  });

  const navigate = useNavigate();

  // Personal Info
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nasc, setNasc] = useState('');
  const [senha, setSenha] = useState('');

  // Address Info
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(false);

  // Status & Submit
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // ViaCEP integration
  useEffect(() => {
    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length === 8) {
      setBuscandoCep(true);
      setErroCep(false);
      fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (data.erro) {
            setErroCep(true);
            setBairro('');
            setCidade('');
            setEstado('');
            setRua('');
          } else {
            setBairro(data.bairro || '');
            setCidade(data.localidade || '');
            setEstado(data.uf || '');
            setRua(data.logradouro || '');
            setErroCep(false);
          }
        })
        .catch(() => {
          setErroCep(true);
        })
        .finally(() => {
          setBuscandoCep(false);
        });
    } else {
      setErroCep(false);
    }
  }, [cep]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cpf.length === 14 && !cpfValidator.isValid(cpf)) {
      setMensagemErro('O CPF informado é inválido. Por favor, verifique.');
      return;
    }

    if (!numero) {
      setMensagemErro('O número do endereço é obrigatório.');
      return;
    }

    setLoading(true);
    setMensagemErro('');

    const payload = {
      cpf: cpf,
      name: nome,
      email: email,
      password: senha,
      birthday: nasc,
      address: {
        cep: cep.replace(/\D/g, ""),
        uf: estado,
        municipio: cidade,
        bairro: bairro,
        logradouro: rua,
        numero: numero,
        complemento: complemento
      }
    };

    const res = await api.register(payload);
    setLoading(false);

    if (res.success) {
      setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/entrar');
      }, 1500);
    } else {
      setMensagemErro(res.error || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f65] via-[#0034a8] to-[#0cc0df] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Dots */}
      <div className="absolute inset-0 dots-bg opacity-10 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img 
              src="/images/Logo.jpg" 
              alt="Conecta Serviços" 
              className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/40 group-hover:scale-105 transition-transform" 
            />
            <div className="text-left">
              <h1 className="text-2xl font-black text-white leading-none">
                Conecta<span className="text-[#0cc0df]">Serviços</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                Novo Cadastro
              </span>
            </div>
          </Link>
          <h2 className="mt-3 text-xl font-bold text-white tracking-tight">
            Crie sua conta no Conecta Serviços
          </h2>
          <p className="text-xs text-blue-100">
            Cadastre seus dados e endereço para contratar ou oferecer serviços
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-3xl border border-white/20">
          
          {mensagemErro && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{mensagemErro}</span>
            </div>
          )}

          {mensagemSucesso && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{mensagemSucesso}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Seção 1: Dados Pessoais */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#001f65]" />
                1. Informações Pessoais
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    ref={cpfRef}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                  {cpf.length === 14 && !cpfValidator.isValid(cpf) && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      CPF inválido
                    </span>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={nasc}
                    onChange={(e) => setNasc(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Senha (mínimo 8 caracteres) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Sua senha secreta"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Endereço Residencial (Obrigatório) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0cc0df]"></span>
                2. Endereço Obrigatório (Para Atendimento)
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Preencha o CEP para preenchimento automático via ViaCEP.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                {/* CEP */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      ref={cepRef}
                      placeholder="00.000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                    />
                    {buscandoCep && (
                      <span className="absolute right-2 top-2 text-[10px] text-blue-600 font-bold">
                        Buscando...
                      </span>
                    )}
                  </div>
                  {erroCep && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      CEP não encontrado
                    </span>
                  )}
                </div>

                {/* Bairro */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-hidden"
                  />
                </div>

                {/* Cidade */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-hidden"
                  />
                </div>

                {/* Estado UF */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UF *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="UF"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-hidden uppercase"
                  />
                </div>

                {/* Rua / Logradouro */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Logradouro"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-hidden"
                  />
                </div>

                {/* Número */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 123"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>

                {/* Complemento */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Complemento (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bloco B, Apto 402, Casa dos Fundos"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || erroCep}
                className="w-full py-3 bg-[#001f65] hover:bg-[#002f99] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Cadastrando..." : "Finalizar Cadastro"}
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Já possui uma conta?{' '}
            <Link to="/entrar" className="font-bold text-[#001f65] hover:underline">
              Fazer login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-blue-100 hover:text-white font-medium hover:underline">
            ← Voltar para a Página Inicial
          </Link>
        </div>

      </div>
    </div>
  );
}
