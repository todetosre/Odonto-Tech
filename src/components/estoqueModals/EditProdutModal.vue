<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal">
      <h2>Editar Produto</h2>
      <form @submit.prevent="saveChanges">
        <input type="text" v-model="produto.cod" placeholder="Código" required readonly>
        <input type="text" v-model="produto.produto" placeholder="Produto" required>
        <input type="text" v-model="produto.categoria" placeholder="Categoria" required>
        <input type="number" v-model="produto.qtd" placeholder="Quantidade" required>
        <input type="date" v-model="produto.datvalidade" placeholder="Data de Validade" required>

        <div class="modal-footer">
          <button type="submit">Salvar</button>
          <button type="button" @click="closeModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['produto', 'showModal'],
  methods: {
    watch: {
  produto: {
    immediate: true,
    handler(novoProduto) {
      this.produtoEditado = { 
        ...novoProduto, 
        datvalidade: novoProduto.datvalidade ? new Date(novoProduto.datvalidade).toISOString().split('T')[0] : '' 
      }; // Formata a data para 'YYYY-MM-DD'
    }
  }
},
    // Função para fechar o modal de edição
    closeModal() {
      this.$emit('close'); // Emite um evento para o componente pai fechar o modal
    },

    // Função para salvar as alterações
    async saveChanges() {
      try {
        await axios.put(`http://localhost:3000/api/estoque/${this.produto.cod}`, this.produto);
        this.$emit('update'); // Emite um evento para o componente pai atualizar a lista de produtos
        this.closeModal();
        alert('Produto atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar o produto:', error.response ? error.response.data : error.message);
        alert('Erro ao atualizar o produto.');
      }
    }
  }
}
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
  box-sizing: border-box;
}

.modal button {
  padding: 8px 15px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
