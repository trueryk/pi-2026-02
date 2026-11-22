import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon
} from '../components/Icons';

const CATEGORIAS_PADRAO = [
  "Reformas e Reparos",
  "Serviços Domésticos",
  "Assistência Técnica",
  "Aulas e Consultoria",
  "Design e Tecnologia",
  "Saúde e Bem-Estar",
  "Outros Serviços"
];

const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

export default function ServiceForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { isLoggedIn, isProvider, isVerifiedProvider, provider, user } = useAuth();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_PADRAO[0]);
  const [preco, setPreco] = useState('');
  const [imagens, setImagens] = useState([
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
  ]);
  const [novaImagem, setNovaImagem] = useState('');
  const [disponibilidades, setDisponibilidades] = useState([
    { diaSemana: "Segunda-feira", horario: "08:00 - 12:00", disponivel: true }
  ]);
  const [ativo, setAtivo] = useState(true);

  // Aux state for adding slot
  const [novoDia, setNovoDia] = useState(DIAS_SEMANA[0]);
  const [novoHorario, setNovoHorario] = useState('09:00 - 13:00');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/entrar');
    }
  }, [isLoggedIn, navigate]);

  // Load existing service if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.getServiceById(id).then((data) => {
        if (data) {
          setNome(data.nome || '');
          setDescricao(data.descricao || '');
          setCategoria(data.categoria || CATEGORIAS_PADRAO[0]);
          setPreco(data.preco ? String(data.preco) : '');
          if (data.imagens && data.imagens.length > 0) setImagens(data.imagens);
          if (data.disponibilidadesSemanais && data.disponibilidadesSemanais.length > 0) {
            setDisponibilidades(data.disponibilidadesSemanais);
          }
          if (data.ativo !== undefined) setAtivo(data.ativo);
        } else {
          setErro('Serviço não encontrado');
        }
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleAddImage = () => {
    if (novaImagem.trim()) {
      setImagens([...imagens, novaImagem.trim()]);
      setNovaImagem('');
    }
  };

  const handleRemoveImage = (index) => {
    setImagens(imagens.filter((_, i) => i !== index));
  };

  const handleAddSlot = () => {
    if (novoDia && novoHorario) {
      setDisponibilidades([
        ...disponibilidades,
        { diaSemana: novoDia, horario: novoHorario, disponivel: true }
      ]);
    }
  };

  const handleRemoveSlot = (index) => {
    setDisponibilidades(disponibilidades.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerifiedProvider) {
      setErro('Atenção: Apenas prestadores com status VERIFICADO podem cadastrar ou editar serviços.');
      return;
    }

    if (!nome.trim() || !preco) {
      setErro('Preencha os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    setErro('');

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      categoria,
      preco: Number(preco),
      imagens: imagens.length > 0 ? imagens : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'],
      disponibilidadesSemanais: disponibilidades,
      ativo,
      idPrestador: provider ? String(provider.id) : (user?.providerId ? String(user.providerId) : String(user?.id)),
      prestadorNome: user?.name || "Prestador",
      prestadorEspecializacao: provider?.specialization || "Especialista"
    };

    let res;
    if (isEditing) {
      res = await api.updateService(id, payload);
    } else {
      res = await api.createService(payload);
    }

    setSubmitting(false);

    if (res.success) {
      setSucesso(isEditing ? 'Serviço atualizado com sucesso!' : 'Serviço publicado com sucesso!');
      setTimeout(() => {
        navigate(`/servico/${res.data.id}`);
      }, 1200);
    } else {
      setErro(res.error || 'Erro ao salvar serviço.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={isEditing ? `/servico/${id}` : "/perfil?tab=prestador"}
            className="inline-flex items-center gap-1.5  font-semibold text-slate-500 hover:text-[#001f65]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>

        {/* Verification Check Warning Banner */}
        {!isVerifiedProvider && (
          <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl text-amber-900 shadow-sm">
            <div>
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
                <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                </span> Status do Prestador: Aguardando Verificação
              </h4>
              <p className=" text-amber-800 mt-1 leading-relaxed">
                Conforme as diretrizes da plataforma, <strong>apenas prestadores com registro verificado</strong> podem publicar ou gerenciar serviços.
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">

          <div className="pb-6  border-slate-100">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {isEditing ? 'Editar Serviço Cadastrado' : `Cadastrar Novo Serviço`}
            </h1>
            <p className=" text-slate-500 mt-0.5">
              Preencha os dados do serviço que ficará visível para os clientes
            </p>
          </div>

          {erro && (
            <div className="my-4 p-3 bg-rose-50 border border-rose-200 text-rose-700  rounded-xl font-medium">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800  rounded-xl font-medium flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>{sucesso}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">

            {/* Informações Básicas */}
            <div className="space-y-4">
              <div>
                <label className="block  font-bold  text-[#001f65]  mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Instalação Elétrica Residencial e Troca de Fiação"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block  font-bold   text-[#001f65]  mb-1">
                    Categoria do Serviço *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                  >
                    {CATEGORIAS_PADRAO.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block  font-bold   text-[#001f65]  mb-1">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="150.00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block  font-bold   text-[#001f65]  mb-1">
                  Descrição Completa do Serviço *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva detalhadamente o que está incluso no serviço, materiais utilizados, garantia e tempo estimado..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full p-3  sm:text-sm rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Imagens do Serviço */}
            <div className="pt-4  border-slate-100">
              <label className="block  font-bold   text-[#001f65]  mb-1">
                Fotos do Serviço (URLs de Imagens)
              </label>
              <p className=" text-slate-500 mb-3">
                Adicione links de fotos do serviço para ilustrar o card e a página de detalhes.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-servico.jpg"
                  value={novaImagem}
                  onChange={(e) => setNovaImagem(e.target.value)}
                  className="flex-1 px-3.5 py-2  rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#001f65] text-white  font-bold rounded-xl hover:bg-[#0034a8] cursor-pointer"
                >
                  Adicionar Foto
                </button>
              </div>

              {/* Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {imagens.map((img, idx) => (
                  <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 shadow-md cursor-pointer"
                      title="Remover foto"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Horários Semanais Disponíveis */}
            <div className="pt-4  border-slate-100">
              <label className="block  font-bold   text-[#001f65] mb-1">
                Horários Semanais de Atendimento
              </label>
              <p className=" text-slate-500 mb-3">
                Defina em quais dias e turnos os clientes podem agendar este serviço.
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <select
                  value={novoDia}
                  onChange={(e) => setNovoDia(e.target.value)}
                  className="px-3 py-2  rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800 bg-white"
                >
                  {DIAS_SEMANA.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Ex: 08:00 - 12:00"
                  value={novoHorario}
                  onChange={(e) => setNovoHorario(e.target.value)}
                  className="px-3 py-2  rounded-xl border border-slate-300 focus:border-[#001f65] outline-hidden text-slate-800"
                />

                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="px-4 py-2 bg-slate-800 text-white  font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  + Inserir Horário
                </button>
              </div>

              {/* Slots List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {disponibilidades.map((slot, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between ">
                    <div>
                      <span className="font-bold text-slate-800">{slot.diaSemana}</span>
                      <span className="text-slate-500 ml-2">({slot.horario})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ativo toggle */}
            <div className="pt-4  border-slate-100 flex items-center gap-3">
              <input
                type="checkbox"
                id="ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="w-4 h-4 text-[#001f65] rounded"
              />
              <label htmlFor="ativo" className=" font-bold text-slate-800 cursor-pointer">
                Serviço Ativo e Disponível para Contratação
              </label>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-6  border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/perfil?tab=prestador"
                className="px-5 py-2.5 rounded-full border border-slate-200 text-[#001f65]   font-semibold hover:bg-slate-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting || !isVerifiedProvider}
                className="px-8 py-3 bg-[#001f65] hover:bg-[#002f99] text-white  font-bold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Salvando...' : isEditing ? 'Atualizar Serviço' : 'Publicar Serviço no Site'}
              </button>
            </div>

          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}
