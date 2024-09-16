<template>
<!-- Modal para adicionar novo produto -->
<div v-if="showAddModal" class="modal-overlay">
  <div class="modal">
    <h2>Adicionar Novo Produto</h2>
    <form @submit.prevent="confirmAddProduto">
      <input type="text" v-model="newProduct.cod" placeholder="Código" required>
      <input type="text" v-model="newProduct.produto" placeholder="Produto" required>
      <input type="text" v-model="newProduct.categoria" placeholder="Categoria" required>
      <input type="number" v-model="newProduct.qtd" placeholder="Quantidade" required>
      <input type="date" v-model="newProduct.datvalidade" placeholder="Data de Validade" required>

      <div class="modal-footer">
        <div class="save-container">
          <button type="submit">Salvar</button>
        </div>
        <div class="cancel-container">
          <button type="button" @click="closeAddModal">Cancelar</button>
        </div>
      </div>
    </form>
  </div>
</div>
  </template>
  
  <script>
  export default {
    props: ['produto', 'showModal'],
    data() {
      return {
        quantidade: 0
      };
    },
    methods: {
  // Função para abrir o modal de adicionar produto
  openAddModal() {
    this.showAddModal = true;
  },
  
  // Função para fechar o modal de adicionar produto
  closeAddModal() {
    this.showAddModal = false;
    this.clearForm();
  },
  
  // Função para adicionar produto
  async confirmAddProduto() {
    try {
      await axios.post('http://localhost:3000/api/estoque', this.newProduct);
      alert('Produto adicionado com sucesso!');
      this.fetchProdutos();
      this.closeAddModal();
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error.response ? error.response.data : error.message);
      alert('Erro ao adicionar o produto.');
    }
  },
  
  // Função para limpar o formulário
  clearForm() {
    this.newProduct = {
      cod: '',
      produto: '',
      categoria: '',
      qtd: '',
      datvalidade: ''
    };
  },
}
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 350px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal input {
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
  }
  
  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
  </style>