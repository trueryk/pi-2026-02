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
    icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-10">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  },
  {
    nome: "Serviços Domésticos",
    icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-10">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>

  },
  {
    nome: "Assistência Técnica",
    icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-10">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>

  },
  {
    nome: "Aulas e Consultoria",
    icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-10">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>

  },
  {
    nome: "Design e Tecnologia",
    icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-10">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>

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
                  className={`group rounded-[1.5rem] h-44 sm:h-52 p-5 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer text-center relative overflow-hidden ${isSelected
                    ? 'bg-white border-2 border-[#001f65] ring-4 ring-[#0cc0df]/30 shadow-2xl scale-103'
                    : 'bg-white hover:bg-slate-50/95 border border-slate-300/90 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                    }`}
                >
                  {/* Espaço para ícone genérico */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110 ${isSelected
                    ? 'bg-[#001f65] text-white shadow-md'
                    : 'bg-[#001f65] text-slate-700'
                    }`}>
                    <span>{cat.icone}</span>
                  </div>

                  {/* Nome da Categoria */}
                  <h3 className={`text-xs sm:text-sm font-bold leading-snug transition-colors px-1 ${isSelected ? 'text-[#001f65]' : 'text-slate-800 group-hover:text-[#001f65]'
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
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
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
