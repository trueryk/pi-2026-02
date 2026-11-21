import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RatingStars from '../components/RatingStars';
import ModalHire from '../components/ModalHire';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CalendarIcon, 
  ArrowLeftIcon, 
  EditIcon, 
  TrashIcon,
  HelpCircleIcon
} from '../components/Icons';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, provider, isFavorite, toggleFavorite, isLoggedIn } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showHireModal, setShowHireModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      const data = await api.getServiceById(id);
      if (data) {
        setService(data);
        const revs = await api.getReviewsByService(id);
        setReviews(revs || []);
      }
      setLoading(false);
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#001f65] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-500 font-medium">Carregando detalhes do serviço...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Serviço não encontrado</h2>
            <p className="text-xs text-slate-500 mb-6">
              O serviço que você tentou acessar não existe ou foi removido pelo prestador.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-[#001f65] text-white text-xs font-bold rounded-full hover:bg-[#0034a8]"
            >
              Voltar para o Início
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFav = isFavorite(service.id);
  const images = (service.imagens && service.imagens.length > 0)
    ? service.imagens
    : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'];

  // Check if current user is the owner of this service
  const isOwner = user && (
    (provider && String(provider.id) === String(service.idPrestador)) ||
    (user.providerId && String(user.providerId) === String(service.idPrestador)) ||
    (user.email && user.email === service.idPrestador)
  );

  const handleDeleteService = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço "${service.nome}"? Esta ação não pode ser desfeita.`)) {
      setDeleteLoading(true);
      await api.deleteService(service.id);
      setDeleteLoading(false);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#001f65] transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Voltar para a lista</span>
          </button>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/servicos/editar/${service.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#001f65] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
              >
                <EditIcon className="w-3.5 h-3.5" />
                <span>Editar Serviço</span>
              </Link>
              <button
                type="button"
                onClick={handleDeleteService}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="aspect-16/10 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md relative group">
              <img
                src={images[selectedImage]}
                alt={service.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
                }}
              />
              {service.categoria && (
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {service.categoria}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImage === idx 
                        ? 'border-[#001f65] ring-2 ring-[#001f65]/20 scale-105' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Descrição Detalhada</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {service.descricao}
              </p>
            </div>

            {/* Weekly Availability Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#0cc0df]" />
                Horários de Atendimento Disponíveis
              </h2>
              {service.disponibilidadesSemanais && service.disponibilidadesSemanais.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.disponibilidadesSemanais.map((disp, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-800">{disp.diaSemana}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{disp.horario}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Disponível
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  O prestador combina o horário de atendimento diretamente após a solicitação.
                </p>
              )}
            </div>

            {/* Avaliações do Serviço */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Avaliações dos Clientes</h2>
                  <p className="text-xs text-slate-500">Comentários de quem já contratou</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-2xl font-black text-[#001f65]">
                      {Number(service.mediaAvaliacoes || 5.0).toFixed(1)}
                    </span>
                    <RatingStars rating={service.mediaAvaliacoes || 5.0} showNumber={false} size="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {reviews.length || service.totalAvaliacoes || 0} avaliações
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 divide-y divide-slate-100">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="pt-3 first:pt-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-800">
                          {rev.usuarioNome || "Cliente Verificado"}
                        </span>
                        <RatingStars rating={rev.nota} size="w-3 h-3" showNumber={true} />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{rev.comentario}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  Ainda não há avaliações para este serviço. Seja o primeiro a contratar e avaliar!
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Action & Provider Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Action Box */}
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Valor da Contratação
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-[#001f65]">
                    R$ {Number(service.preco || 0).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-slate-500">/ serviço</span>
                </div>
              </div>

              {/* Title & Stats */}
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-snug">
                  {service.nome}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <RatingStars rating={service.mediaAvaliacoes || 5.0} count={service.totalAvaliacoes || 1} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHireModal(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#001f65] to-[#003db3] hover:from-[#002882] hover:to-[#0048d3] text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <CalendarIcon className="w-5 h-5 text-[#0cc0df] group-hover:scale-110 transition-transform" />
                  <span>Contratar Serviço Agora</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/entrar');
                      return;
                    }
                    toggleFavorite(service.id);
                  }}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    isFav
                      ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <HeartIcon className="w-4 h-4" filled={isFav} />
                  <span>{isFav ? 'Salvo nos Interesses' : 'Salvar como Interesse'}</span>
                </button>
              </div>

              {/* Guarantee highlights */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Garantia de atendimento ou seu dinheiro de volta</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#0cc0df] shrink-0" />
                  <span>Agendamento rápido com confirmação</span>
                </div>
              </div>

              {/* Provider Information Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sobre o Prestador
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#001f65] to-[#0cc0df] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {service.prestadorNome ? service.prestadorNome[0] : 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {service.prestadorNome || "Profissional Cadastrado"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {service.prestadorEspecializacao || "Especialista em Serviços"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Prestador Verificado</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Modal de Contratação */}
      {showHireModal && (
        <ModalHire
          service={service}
          onClose={() => setShowHireModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
