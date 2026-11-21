import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ClockIcon, MapPinIcon, ShieldCheckIcon } from './Icons';

export default function ModalHire({ service, onClose, onHired }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#001f65] flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Faça login para contratar</h3>
          <p className="text-sm text-slate-600 mb-6">
            Apenas usuários autenticados com endereço cadastrado podem solicitar e contratar serviços no Conecta Serviços.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => navigate('/entrar')}
              className="px-6 py-2.5 rounded-full bg-[#001f65] hover:bg-[#0034a8] text-white text-sm font-semibold shadow-md"
            >
              Fazer Login Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  const primaryAddress = user?.addresses && user.addresses.length > 0 
    ? user.addresses[0] 
    : null;

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot && !selectedDate) {
      setError('Por favor, escolha um horário ou informe a data preferida.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      idServico: service.id,
      diaSemana: selectedSlot.split(' - ')[0] || 'A combinar',
      horario: selectedSlot.split(' - ')[1] || 'Horário comercial',
      dataHora: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString()
    };

    const res = await api.createContract(payload);

    setSubmitting(false);
    if (res.success) {
      setSuccess(true);
      if (onHired) onHired(res.data);
    } else {
      setError(res.error || 'Não foi possível concluir a contratação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Contratação Solicitada!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Seu pedido para <strong className="text-slate-900">{service.nome}</strong> foi registrado com sucesso. O prestador foi notificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Continuar Navegando
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/perfil?tab=contratos');
                }}
                className="px-6 py-2.5 rounded-full bg-[#001f65] hover:bg-[#0034a8] text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                Ver Meus Serviços Contratados
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleHireSubmit}>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0cc0df]">
                  Contratação Direta
                </span>
                <h3 className="text-lg font-bold text-slate-900">{service.nome}</h3>
                <p className="text-xs text-slate-500">
                  Prestador: {service.prestadorNome || "Profissional Verificado"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="my-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Price Preview */}
            <div className="my-4 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Valor do Serviço</span>
                <p className="text-2xl font-black text-[#001f65]">
                  R$ {Number(service.preco || 0).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Garantia Conecta
              </span>
            </div>

            {/* Schedule Selection */}
            <div className="space-y-3 mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Escolha o Horário de Atendimento
              </label>

              {service.disponibilidadesSemanais && service.disponibilidadesSemanais.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.disponibilidadesSemanais.map((disp, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedSlot(`${disp.diaSemana} - ${disp.horario}`)}
                      className={`p-2.5 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        selectedSlot === `${disp.diaSemana} - ${disp.horario}`
                          ? 'border-[#001f65] bg-blue-50/70 text-[#001f65] ring-2 ring-[#001f65]/20 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <p className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-[#0cc0df]" />
                        <span>{disp.diaSemana}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{disp.horario}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Horário flexível conforme disponibilidade do prestador.
                </p>
              )}

              {/* Custom Date Picker */}
              <div className="mt-2">
                <label className="block text-xs text-slate-500 mb-1">
                  Ou agende para uma data específica:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Registered Address Check */}
            <div className="mb-4 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#001f65] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Local de Execução:</span>
                  {primaryAddress ? (
                    <p className="text-slate-600 mt-0.5">
                      {primaryAddress.logradouro}, {primaryAddress.numero}
                      {primaryAddress.complemento ? ` (${primaryAddress.complemento})` : ''} - {primaryAddress.bairro}, {primaryAddress.municipio}/{primaryAddress.uf} (CEP: {primaryAddress.cep})
                    </p>
                  ) : (
                    <p className="text-amber-700 mt-0.5">
                      Você pode atualizar seu endereço no seu perfil a qualquer momento.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Observações para o Prestador (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: portaria libera entrada às 09h; favor trazer escada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#001f65] outline-hidden text-slate-700"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#001f65] hover:bg-[#0034a8] text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Confirmando...' : 'Confirmar e Contratar'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
