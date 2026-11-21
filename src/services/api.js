// API Service for Conecta Serviços
// Operação exclusiva com os back-ends reais:
// - Relational (MariaDB/MySQL) na Porta 8080 (Auth, User, Address, Provider)
// - NoSQL (MongoDB) na Porta 8081 (Servicos, Contratos, Avaliacoes)

const API_RELATIONAL = 'http://localhost:8080/api';
const API_NOSQL = 'http://localhost:8081/api';

export function getToken() {
  return localStorage.getItem('conecta_token') || '';
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('conecta_token', token);
  } else {
    localStorage.removeItem('conecta_token');
  }
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // ================= AUTH (PORT 8080 - RELACIONAL) =================
  async login(email, password) {
    try {
      const res = await fetch(`${API_RELATIONAL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        return { success: true, data };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'E-mail ou senha inválidos' };
    } catch (_e) {
      return { success: false, error: 'Não foi possível conectar ao servidor de autenticação (Porta 8080).' };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao cadastrar usuário' };
    } catch (_e) {
      return { success: false, error: 'Não foi possível conectar ao servidor de cadastro (Porta 8080).' };
    }
  },

  // ================= USER & PROFILE (PORT 8080) =================
  async getMe() {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      console.warn('Erro ao carregar dados do usuário na API');
    }
    return null;
  },

  async updateMe(userData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        return { success: true, data: await res.json() };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao atualizar dados' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  // ================= ADDRESSES (PORT 8080) =================
  async getAddresses() {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/addresses`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao carregar endereços');
    }
    return [];
  },

  async addAddress(addressData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao cadastrar endereço' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  async updateAddress(id, addressData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/addresses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao atualizar endereço' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  async deleteAddress(id) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (_e) {
      return false;
    }
  },

  // ================= PROVIDER (PORT 8080) =================
  async getProvider() {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/provider`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao obter dados do prestador');
    }
    return null;
  },

  async registerProvider(providerData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/provider`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(providerData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao registrar prestador' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  async updateProvider(providerData) {
    try {
      const res = await fetch(`${API_RELATIONAL}/users/me/provider`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(providerData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao atualizar prestador' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  // ================= SERVIÇOS (PORT 8081 - NOSQL) =================
  async getServices(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.nome) query.append('nome', params.nome);
      if (params.idPrestador) query.append('idPrestador', params.idPrestador);
      if (params.apenasAtivos !== undefined) query.append('apenasAtivos', params.apenasAtivos);

      const url = `${API_NOSQL}/servicos${query.toString() ? '?' + query.toString() : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      console.warn('Erro ao carregar serviços da API NoSQL');
    }
    return [];
  },

  async getServiceById(id) {
    try {
      const res = await fetch(`${API_NOSQL}/servicos/${id}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao buscar serviço por ID');
    }
    return null;
  },

  async createService(serviceData) {
    try {
      const res = await fetch(`${API_NOSQL}/servicos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao criar serviço' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor NoSQL (Porta 8081)' };
    }
  },

  async updateService(id, serviceData) {
    try {
      const res = await fetch(`${API_NOSQL}/servicos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao atualizar serviço' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor NoSQL' };
    }
  },

  async deleteService(id) {
    try {
      const res = await fetch(`${API_NOSQL}/servicos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (_e) {
      return false;
    }
  },

  // ================= CONTRATOS (PORT 8081 - NOSQL) =================
  async getMyContracts() {
    try {
      const res = await fetch(`${API_NOSQL}/contratos/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao carregar contratos');
    }
    return [];
  },

  async createContract(contractData) {
    try {
      const res = await fetch(`${API_NOSQL}/contratos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contractData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao contratar serviço' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor NoSQL' };
    }
  },

  async cancelContract(id, motivo = '') {
    try {
      const res = await fetch(`${API_NOSQL}/contratos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ motivoCancelamento: motivo })
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao cancelar contrato' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  // ================= AVALIAÇÕES (PORT 8081 - NOSQL) =================
  async createReview(reviewData) {
    try {
      const res = await fetch(`${API_NOSQL}/avaliacoes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      if (res.ok) return { success: true, data: await res.json() };
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Erro ao registrar avaliação' };
    } catch (_e) {
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  },

  async getReviewsByService(idServico) {
    try {
      const res = await fetch(`${API_NOSQL}/avaliacoes/servico/${idServico}`);
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao obter avaliações do serviço');
    }
    return [];
  },

  async getMyReviews() {
    try {
      const res = await fetch(`${API_NOSQL}/avaliacoes/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (_e) {
      console.warn('Erro ao obter minhas avaliações');
    }
    return [];
  }
};
