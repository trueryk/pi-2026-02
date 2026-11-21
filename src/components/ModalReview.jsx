import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { api } from '../services/api';

export default function ModalReview({ contract, onClose, onReviewed }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      setError('Por favor, escreva um breve comentário sobre o atendimento.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await api.createReview({
      idContrato: contract.id,
      nota: Number(nota),
      comentario: comentario.trim()
    });

    setSubmitting(false);
    if (res.success) {
      if (onReviewed) onReviewed(res.data);
      onClose();
    } else {
      setError(res.error || 'Erro ao registrar avaliação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#0cc0df]">
              Avaliação do Serviço
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {contract.servicoNome || "Serviço Concluído"}
            </h3>
            <p className="text-xs text-slate-500">
              Prestador: {contract.prestadorNome || "Profissional"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Toque nas estrelas para avaliar:
            </label>
            <div className="flex justify-center">
              <RatingStars
                rating={nota}
                interactive={true}
                size="w-8 h-8"
                onRate={(val) => setNota(val)}
                showNumber={true}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {nota === 5 ? '⭐ Excelente' : nota >= 4 ? '👍 Muito Bom' : nota >= 3 ? '👌 Regular' : '👎 Insatisfeito'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Seu Depoimento / Comentário:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Conte como foi sua experiência com o serviço e a pontualidade do profissional..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700 placeholder-slate-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-md cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Publicar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
