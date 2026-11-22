import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Brand Header Banner - Ocupa o espaço com destaque */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-4 group">
            <img 
              src="/images/Logo.jpg" 
              alt="Conecta Serviços" 
              className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-slate-700 group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                <span className="text-white">Conecta</span>
                <span className="text-[#0cc0df]">Serviços</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8">
          
          {/* Categorias Col */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase  mb-4">
              Categorias Populares
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/?search=Reformas" className="hover:text-white transition-colors">Reformas e Reparos</Link></li>
              <li><Link to="/?search=Limpeza" className="hover:text-white transition-colors">Serviços Domésticos</Link></li>
              <li><Link to="/?search=Climatização" className="hover:text-white transition-colors">Assistência Técnica</Link></li>
              <li><Link to="/?search=Aulas" className="hover:text-white transition-colors">Aulas e Consultoria</Link></li>
              <li><Link to="/?search=Design" className="hover:text-white transition-colors">Design e Tecnologia</Link></li>
            </ul>
          </div>

          {/* Navegação Col */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase  mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Início / Serviços</Link></li>
              <li><Link to="/perfil" className="hover:text-white transition-colors">Meu Perfil</Link></li>
              <li><Link to="/perfil?tab=contratos" className="hover:text-white transition-colors">Meus Pedidos de Serviço</Link></li>
              <li><Link to="/perfil?tab=prestador" className="hover:text-white transition-colors">Seja um Prestador</Link></li>
              <li><Link to="/perfil?tab=favoritos" className="hover:text-white transition-colors">Meus Interesses</Link></li>
            </ul>
          </div>

          {/* Atendimento Col */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase  mb-4">
              Atendimento
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/perfil" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/cadastrar" className="hover:text-white transition-colors">Criar Nova Conta</Link></li>
              <li><Link to="/entrar" className="hover:text-white transition-colors">Entrar no Perfil</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Conecta Serviços. Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  );
}
