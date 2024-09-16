<template>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h2>Remover Produto</h2>
        <p>Quantidade atual: {{ selectedProduto.qtd }}</p>
        <form @submit.prevent="removeProduto">
          <input type="number" v-model="quantidade" placeholder="Quantidade a remover" required>
  
          <div class="modal-footer">
            <button type="submit">Remover</button>
            <button type="button" @click="closeModal">Cancelar</button>
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
  // Função para abrir o modal de remoção
  removeProduct(produto) {
    this.selectedProduto = produto;
    this.showRemoveModal = true;
  },

  // Função para fechar o modal de remoção
  closeRemoveModal() {
    this.showRemoveModal = false;
  },

  // Função para confirmar a remoção do produto
  async confirmRemoveProduto() {
    try {
      await axios.delete(`http://localhost:3000/api/estoque/${this.selectedProduto.cod}`);
      this.fetchProdutos();
      this.closeRemoveModal();
      alert('Produto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover o produto:', error.response ? error.response.data : error.message);
      alert('Erro ao remover o produto.');
    }
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
  