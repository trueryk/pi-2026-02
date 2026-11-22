import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircleIcon, CheckCircleIcon } from './Icons';

export default function ModalSupport({ onClose }) {
  const { user } = useAuth();
  const [categoria, setCategoria] = useState('Dúvida sobre contratação');
  const [email, setEmail] = useState(user?.email || '');
  const [mensagem, setMensagem] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProt = 'SUP-' + Math.floor(100000 + Math.random() * 900000);
    setProtocolo(newProt);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Chamado Aberto!</h3>
            <p className="text-xs text-slate-500 mb-3">
              Protocolo: <strong className="text-slate-800 font-mono text-sm">{protocolo}</strong>
            </p>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Recebemos sua mensagem com sucesso. Nossa equipe de suporte responderá para o e-mail <strong>{email}</strong> em até 24 horas úteis.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#001f65] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#0034a8]"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-[#001f65]">
                  <HelpCircleIcon className="w-5 h-5 text-[#0cc0df]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Suporte Conecta Serviços</h3>
                  <p className="text-xs text-slate-500">Estamos aqui para ajudar você</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qual é o motivo do contato?
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700 bg-white"
                >
                  <option value="Dúvida sobre contratação">Dúvida sobre contratação de serviço</option>
                  <option value="Problema com prestador">Problema com prestador ou atendimento</option>
                  <option value="Agendamento e Horários">Dúvidas sobre agendamento ou cancelamento</option>
                  <option value="Cadastro de Prestador">Quero ser prestador / Verificação de perfil</option>
                  <option value="Reportar Erro ou Bug">Reportar falha ou problema técnico</option>
                  <option value="Outros Assuntos">Outro assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Seu e-mail para retorno
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Descreva sua solicitação
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explique com detalhes o que aconteceu ou qual é sua dúvida..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700 placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#001f65] hover:bg-[#0034a8] text-white text-xs font-bold rounded-full shadow-md cursor-pointer"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
