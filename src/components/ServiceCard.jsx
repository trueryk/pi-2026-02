import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';
import { HeartIcon, ShieldCheckIcon } from './Icons';

export default function ServiceCard({ service }) {
  const { isFavorite, toggleFavorite, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isFav = isFavorite(service.id);
  const mainImage = (service.imagens && service.imagens.length > 0) 
    ? service.imagens[0] 
    : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      if (window.confirm('Você precisa estar logado para salvar serviços nos seus interesses. Deseja fazer login agora?')) {
        navigate('/entrar');
      }
      return;
    }
    toggleFavorite(service.id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={service.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
            isFav 
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title={isFav ? "Remover dos interesses" : "Salvar como interesse"}
        >
          <HeartIcon className="w-4 h-4" filled={isFav} />
        </button>

        {/* Category Pill */}
        {service.categoria && (
          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {service.categoria}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 gap-2">
            <span className="truncate font-medium text-slate-700">
              {service.prestadorNome || "Profissional Verificado"}
            </span>
            <span className="shrink-0 flex items-center text-emerald-600 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheckIcon className="w-3.5 h-3.5 mr-0.5" />
              Verificado
            </span>
          </div>

          {/* Service Title */}
          <Link to={`/servico/${service.id}`}>
            <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-[#001f65] transition-colors leading-snug">
              {service.nome}
            </h3>
          </Link>

          {/* Brief Description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.descricao}
          </p>
        </div>

        {/* Rating and Price Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <RatingStars 
              rating={service.mediaAvaliacoes || 5.0} 
              count={service.totalAvaliacoes || 1} 
              size="w-3.5 h-3.5"
            />
            <p className="text-[11px] text-slate-400 mt-1">Preço do serviço</p>
            <p className="text-lg font-black text-[#001f65] leading-none">
              R$ {Number(service.preco || 0).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <Link
            to={`/servico/${service.id}`}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-[#001f65] text-[#001f65] hover:text-white text-xs font-bold rounded-lg transition-all shadow-2xs hover:shadow-sm"
          >
            Ver Detalhes
          </Link>
        </div>

      </div>

    </div>
  );
}
