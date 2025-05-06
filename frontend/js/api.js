const API_URL = '/api/filmes';

class ApiService {
  static async getFilmes() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }
  }
  
  static async getFilme(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error(`Erro ao buscar filme ${id}:`, error);
      throw error;
    }
  }
  
  static async getFilmeWithComments(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/with-comments`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error(`Erro ao buscar filme com comentários ${id}:`, error);
      throw error;
    }
  }
  
  static async getComments(movieId) {
    try {
      const response = await fetch(`${API_URL}/${movieId}/comments`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error(`Erro ao buscar comentários para o filme ${movieId}:`, error);
      throw error;
    }
  }
  
  static async addComment(movieId, comment) {
    try {
      const response = await fetch(`${API_URL}/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }
  
  static async deleteComment(commentId) {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir comentário ${commentId}:`, error);
      throw error;
    }
  }
  
  static async criarFilme(filme) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filme)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Erro ao criar filme:', error);
      throw error;
    }
  }
  
  static async atualizarFilme(id, filme) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filme)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error(`Erro ao atualizar filme ${id}:`, error);
      throw error;
    }
  }
  
  static async excluirFilme(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir filme ${id}:`, error);
      throw error;
    }
  }
}