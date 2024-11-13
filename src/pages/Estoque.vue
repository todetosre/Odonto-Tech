<template>
  <div class="main">
    <div class="botao">
      <button id="new" @click="openModal">Novo Produto</button>
    </div>

    <div class="option-selectores">
      <button
        id="geral-button"
        :class="{ active: activeButton === 'geral' }"
        @click="setActiveButton('geral')"
      >Geral</button>
      <button
        id="lower-button"
        :class="{ active: activeButton === 'lower' }"
        @click="setActiveButton('lower')"
      >Baixo Estoque</button>
      <button
        id="valid-button"
        :class="{ active: activeButton === 'valid' }"
        @click="setActiveButton('valid')"
      >Validade</button>
    </div>

    <div class="main-bar">
      <div class="buscar">
        <div class="search-bar">
          <input type="search" v-model="searchTerm" placeholder="Buscar Produto">
          <button class="search-button" @click="fetchProdutos">
            <img src="../components/icons/lupa.png" alt="lupa-icon">
          </button>
        </div>
      </div>

      <div class="geral-bar">
        <div class="header">
          <span>Cód.</span>
          <span>Produto</span>
          <span>Categoria</span>
          <span>Quantidade</span>
          <span>Data de validade</span>
          <span>Ação</span>
        </div>

        <div class="product-row" v-for="produto in produtos" :key="produto.cod">
          <span>{{ produto.cod }}</span>
          <span>{{ produto.produto }}</span>
          <span>{{ produto.categoria }}</span>
          <span>{{ produto.qtd }}</span>
          <span>{{ formatDate(produto.datvalidade) }}</span>
          <div class="action-buttons">
            <button @click="editProduct(produto)">
              <img src="../components/icons/lapis.png" alt="Icon-Editar">
            </button>
            <button @click="openRemoveModal(produto)">
              <img src="../components/icons/lixeira-de-reciclagem.png" alt="Icon-Excluir">
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para adicionar novo produto -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Adicionar Novo Produto</h2>
        <form @submit.prevent="addProduct">
          <input type="text" v-model="newProduct.cod" placeholder="Código" required>
          <input type="text" v-model="newProduct.produto" placeholder="Produto" required>
          <input type="text" v-model="newProduct.categoria" placeholder="Categoria" required>
          <input type="number" v-model="newProduct.qtd" placeholder="Quantidade" required>
          <input type="date" v-model="newProduct.datvalidade" placeholder="Data de Validade" required>
          <div class="modal-footer">
            <button type="submit">Salvar</button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para editar produto -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h2>Editar Produto</h2>
        <form @submit.prevent="updateProduct">
          <input type="text" v-model="selectedProduct.produto" placeholder="Produto" required>
          <input type="text" v-model="selectedProduct.categoria" placeholder="Categoria" required>
          <input type="number" v-model="selectedProduct.qtd" placeholder="Quantidade" required>
          <input type="date" v-model="selectedProduct.datvalidade" placeholder="Data de Validade" required>
          <div class="modal-footer">
            <button type="submit">Salvar</button>
            <button type="button" @click="closeEditModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para remover quantidade de produto -->
    <div v-if="showRemoveModal" class="modal-overlay">
      <div class="modal">
        <h2>Remover Quantidade de Produto</h2>
        <p>Produto: {{ selectedProduct.produto }}</p>
        <form @submit.prevent="decrementProductQuantity">
          <input
            type="number"
            v-model.number="removeQuantity"
            min="1"
            :max="selectedProduct.qtd"
            placeholder="Quantidade a remover"
            required
          />
          <div class="modal-footer">
            <button type="submit">Confirmar</button>
            <button type="button" @click="closeRemoveModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EstoqueView',
  data() {
    return {
      searchTerm: '',
      activeButton: 'geral',
      showModal: false,
      showEditModal: false,
      showRemoveModal: false,
      produtos: [],
      newProduct: {
        cod: '',
        produto: '',
        categoria: '',
        qtd: '',
        datvalidade: ''
      },
      selectedProduct: null,
      removeQuantity: 1
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    setActiveButton(button) {
      this.activeButton = button;
      this.fetchProdutos();
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.clearForm();
    },
    clearForm() {
      this.newProduct = {
        cod: '',
        produto: '',
        categoria: '',
        qtd: '',
        datvalidade: ''
      };
    },
    async addProduct() {
      try {
        await axios.post('http://localhost:3000/api/estoque', this.newProduct);
        this.fetchProdutos();
        this.closeModal();
        alert('Produto adicionado com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar o produto:', error);
        alert('Erro ao adicionar o produto.');
      }
    },
    async fetchProdutos() {
      try {
        let url = 'http://localhost:3000/api/estoque';
        if (this.activeButton === 'lower') {
          url = 'http://localhost:3000/api/estoque/baixo-estoque';
        } else if (this.activeButton === 'valid') {
          url = 'http://localhost:3000/api/estoque/validade';
        }

        const response = await axios.get(url, { params: { search: this.searchTerm } });
        this.produtos = response.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Erro ao buscar produtos.');
      }
    },
    editProduct(produto) {
      this.selectedProduct = { ...produto };
      if (this.selectedProduct.datvalidade) {
    this.selectedProduct.datvalidade = new Date(this.selectedProduct.datvalidade).toISOString().split('T')[0];
  }
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedProduct = null;
    },
    async updateProduct() {
      try {
        await axios.put(`http://localhost:3000/api/estoque/${this.selectedProduct.cod}`, this.selectedProduct);
        this.fetchProdutos();
        this.closeEditModal();
        alert('Produto atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        alert('Erro ao atualizar o produto.');
      }
    },
    openRemoveModal(produto) {
      this.selectedProduct = produto;
      this.showRemoveModal = true;
    },
    closeRemoveModal() {
      this.showRemoveModal = false;
      this.removeQuantity = 1;
      this.selectedProduct = null;
    },
    async decrementProductQuantity() {
      if (this.removeQuantity > this.selectedProduct.qtd) {
        alert('Quantidade para remover é maior que a quantidade disponível.');
        return;
      }

      const updatedProduct = {
        ...this.selectedProduct,
        qtd: this.selectedProduct.qtd - this.removeQuantity
      };

      try {
        await axios.put(`http://localhost:3000/api/estoque/${updatedProduct.cod}`, updatedProduct);
        this.fetchProdutos();
        alert('Quantidade removida com sucesso!');
        this.closeRemoveModal();
      } catch (error) {
        console.error('Erro ao remover a quantidade do produto:', error);
        alert('Erro ao remover a quantidade do produto.');
      }
    },
  },
  created() {
    this.fetchProdutos();
  },
  watch: {
    searchTerm() {
      this.fetchProdutos();
    }
  }
};
</script>

  <style scoped>
/* Suas importações e estilos globais */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

/* Estilos da página */
.main {
  position: fixed;
  top: 5px;
  left: 255px;
  background-color: rgb(216, 216, 216);
  width: 1105px;
  height: 900px;
}

.botao {
  position: fixed;
  top: 10px;
  left: 1080px;
}

/* Estilos dos botões */
#new {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 10px 20px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

#new:hover {
  background-color: #fff;
  color: #08396b;
}

#geral-button,
#lower-button,
#valid-button {
  position: fixed;
  background: rgb(216, 216, 216);
  color: black;
  cursor: pointer;
  border: 1px solid black;
  font-size: inherit;
  padding: 13px 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

#geral-button {
  left: 265px;
  top: 157px;
}

#lower-button {
  left: 400px;
  top: 157px;
}

#valid-button {
  left: 614px;
  top: 157px;
}

#geral-button:hover,
#lower-button:hover,
#valid-button:hover {
  background-color: #fff;
  color: black;
  top: 150px;
}

#geral-button.active,
#lower-button.active,
#valid-button.active {
  background-color: #fff;
  color: black;
  top: 150px;
  border-bottom: 2px solid black; /* Adiciona uma borda inferior para destacar o botão ativo */
}

#geral-button:not(.active):hover,
#lower-button:not(.active):hover,
#valid-button:not(.active):hover {
  background-color: #fff;
  color: black;
  top: 150px;
}

#geral-button,
#lower-button,
#valid-button {
  top: 157px; /* Posição inicial */
}

/* Estilos da barra principal */
.main-bar {
  position: fixed;
  top: 200px;
  left: 265px;
  height: 500px;
  width: 1085px;
  background-color: white;
  border: 1px solid black;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-left: 860px;
  margin-top: 10px;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
}

.search-button img {
  width: 20px;
  height: 20px;
  margin-top: 4px;
}

/* Estilos da barra geral */
.geral-bar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: rgb(216, 216, 216);
  position: absolute;
  top: 50px;
  left: 10px;
  width: 1060px;
  height: 400px;
  overflow-y: auto;
  color: black;
}

/* Estilos do header fixo */
.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; /* Define a largura de cada coluna */
  justify-items: center; /* Centraliza o conteúdo de cada coluna */
  align-items: center;
  background-color: #f1f1f1;
  padding: 10px;
  padding-left: 0px; /* Move o header para a esquerda */
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
}

/* Estilos de cada linha de produto */
.product-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; /* Mesma estrutura do header para alinhamento */
  align-items: center;
  gap: 0px;
  padding: 5px 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  justify-items: center; /* Centraliza o conteúdo de cada coluna */
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center; /* Centraliza os botões dentro da célula */
  align-items: center;
}

.action-buttons button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  margin: 0;
}

.action-buttons img {
  width: 20px; /* Ajuste o tamanho conforme necessário */
  height: 20px; /* Ajuste o tamanho conforme necessário */
}

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
  color: black;
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
  justify-content: space-between; /* Distribui os botões nas extremidades */
  margin-top: 10px;
}

.modal-footer .footer-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between; /* Alinha os botões nas extremidades */
}

.modal-footer .save-button {
  margin-right: auto; /* Empurra o botão "Salvar" para o início */
}

.modal-footer .cancel-button {
  margin-left: auto; /* Empurra o botão "Cancelar" para o final */
}

</style>