import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';
import { SearchIcon, FilterIcon, BriefcaseIcon } from '../components/Icons';

const CATEGORIES = [
  "Todas",
  "Reformas e Reparos",
  "Serviços Domésticos",
  "Assistência Técnica",
  "Aulas e Consultoria",
  "Design e Tecnologia"
];

const FEATURED_CATEGORIES = [
  {
    nome: "Reformas e Reparos",
    icone: "🔧"
  },
  {
    nome: "Serviços Domésticos",
    icone: "🧹"
  },
  {
    nome: "Assistência Técnica",
    icone: "⚙️"
  },
  {
    nome: "Aulas e Consultoria",
    icone: "📚"
  },
  {
    nome: "Design e Tecnologia",
    icone: "💻"
  }
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("melhores");

  const servicesSectionRef = useRef(null);

  // Load services
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await api.getServices({
        nome: searchParam,
        apenasAtivos: true
      });
      setServices(data || []);
      setLoading(false);
    }
    loadData();
  }, [searchParam]);

  // Filter & Sort
  const filteredServices = services
    .filter(s => {
      if (selectedCategory === "Todas") return true;
      return s.categoria === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "menor_preco") return a.preco - b.preco;
      if (sortBy === "maior_preco") return b.preco - a.preco;
      return (b.mediaAvaliacoes || 0) - (a.mediaAvaliacoes || 0);
    });

  const handleSearch = (term) => {
    if (term) {
      setSearchParams({ search: term });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryCardClick = (catNome) => {
    if (selectedCategory === catNome) {
      setSelectedCategory("Todas");
    } else {
      setSelectedCategory(catNome);
    }
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onSearch={handleSearch} currentSearch={searchParam} />

      <main className="flex-1">
        
        {/* Hero Section Expandido com fundo azul e pontilhados conforme protótipo */}
        <div className="relative bg-gradient-to-b from-[#001f65] to-[#004dff] text-white h-[50vh] min-h-[380px] flex items-center justify-center px-4 overflow-hidden">
          
          {/* Título principal perfeitamente centralizado */}
          <div className="text-center z-10">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight select-none">
              <span className="text-[#0cc0df]">Conecta</span>
              <span className="text-white">Serviços</span>
            </h1>
          </div>

          {/* Área de pontilhados à direita conforme protótipo */}
          <div className="absolute right-6 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 hidden md:block w-[28vw] max-w-[340px] h-[34vh] dots-bg opacity-45 rounded-2xl pointer-events-none"></div>
        </div>

        {/* Cards de Categorias (Sem fundo branco envoltório, sobrepondo a borda do hero azul) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {FEATURED_CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.nome;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCategoryCardClick(cat.nome)}
                  className={`group rounded-[1.5rem] h-44 sm:h-52 p-5 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer text-center relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-2 border-[#001f65] ring-4 ring-[#0cc0df]/30 shadow-2xl scale-103'
                      : 'bg-white hover:bg-slate-50/95 border border-slate-300/90 hover:border-blue-400 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                  }`}
                >
                  {/* Espaço para ícone genérico */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110 ${
                    isSelected 
                      ? 'bg-[#001f65] text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#001f65]'
                  }`}>
                    <span>{cat.icone}</span>
                  </div>

                  {/* Nome da Categoria */}
                  <h3 className={`text-xs sm:text-sm font-bold leading-snug transition-colors px-1 ${
                    isSelected ? 'text-[#001f65]' : 'text-slate-800 group-hover:text-[#001f65]'
                  }`}>
                    {cat.nome}
                  </h3>

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0cc0df]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Indicador de filtro ativo se selecionado */}
          {selectedCategory !== "Todas" && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCategory("Todas")}
                className="text-xs font-bold text-[#001f65] hover:underline bg-white px-3 py-1.5 rounded-full shadow-xs border border-slate-200 cursor-pointer"
              >
                ✕ Limpar filtro: {selectedCategory} (Mostrar Todas)
              </button>
            </div>
          )}
        </section>

        {/* Content Section: Lista de Serviços */}
        <div ref={servicesSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Quick Categories Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#001f65] text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search info & Filter bar */}
          <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {searchParam ? (
                  <>Resultados para: <span className="text-[#001f65]">"{searchParam}"</span></>
                ) : (
                  selectedCategory === "Todas" ? "Todos os Serviços" : selectedCategory
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredServices.length} {filteredServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
              </p>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <FilterIcon className="w-3.5 h-3.5" /> Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-hidden focus:border-[#001f65]"
              >
                <option value="melhores">Melhor Avaliados</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#001f65] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-slate-500 font-medium">Carregando serviços...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum serviço encontrado</h3>
              <p className="text-xs text-slate-500 mb-6">
                Não encontramos nenhum serviço com os filtros selecionados.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Todas");
                  setSearchParams({});
                }}
                className="px-5 py-2.5 bg-[#001f65] text-white text-xs font-bold rounded-full hover:bg-[#0034a8] transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Become Provider CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 via-[#001f65] to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Para Profissionais
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-6 leading-tight">
                Você é prestador de serviços? Cadastre-se na plataforma
              </h3>
              <Link
                to="/perfil?tab=prestador"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0cc0df] hover:bg-[#0aa6c2] text-[#001f65] font-bold text-xs sm:text-sm rounded-full shadow-lg transition-transform hover:scale-105"
              >
                <BriefcaseIcon className="w-4 h-4" />
                <span>Começar Agora como Prestador</span>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
