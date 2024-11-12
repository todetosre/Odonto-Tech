<template>
  <div class="main"></div>
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
        <button class="search-button">
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
          <button @click="removeProduct(produto.cod)">
            <img src="../components/icons/lixeira-de-reciclagem.png" alt="Icon-Excluir">
          </button>
          <button @click="addProduct()">
            <img src="../components/icons/adicionar.png" alt="Icon-Adicionar">
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
          <div class="save-container">
            <button type="submit">Salvar</button>
          </div>
          <div class="cancel-container">
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal para editar produto -->
  <EditProdutModal :produto="selectedProduct" :showModal="showEditModal" @close="closeEditModal" @save="updateProduct"/>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import EditProdutModal from '@/components/estoqueModals/EditProdutModal.vue'; // Importe o componente modal

export default {
  name: 'EstoqueView',
  components: {
    NavBar,
    EditProdutModal // Adicione o componente modal aqui
  },
  data() {
    return {
      searchTerm: '',
      activeButton: 'geral',
      showModal: false,
      showEditModal: false, // Para mostrar o modal de edição
      produtos: [],
      newProduct: {
        cod: '',
        produto: '',
        categoria: '',
        qtd: '',
        datvalidade: ''
      },
      selectedProduct: null // Para armazenar o produto selecionado
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
      this.fetchProdutos(); // Atualiza a lista quando o botão é ativado
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
      if (!this.newProduct.cod || isNaN(this.newProduct.cod)) {
        alert('Por favor, insira um código válido.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/estoque', this.newProduct);
        alert('Produto adicionado com sucesso!');
        this.fetchProdutos();
        this.closeModal();
      } catch (error) {
        console.error('Erro ao adicionar o produto:', error.response ? error.response.data : error.message);
        alert('Erro ao adicionar o produto.');
      }
    },
    async fetchProdutos() {
      try {
        let url = 'http://localhost:3000/api/estoque';
        if (this.activeButton === 'lower') {
          url = 'http://localhost:3000/api/estoque/baixo-estoque';
        } else if (this.activeButton === 'valid') {
          url = 'http://localhost:3000/api/estoque/validade'; // URL para produtos com validade
        }

        const response = await axios.get(url, {
          params: { search: this.searchTerm } // Envia o termo de busca como parâmetro
        });
        this.produtos = response.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Erro ao buscar produtos.');
      }
    },
    async removeProduct(cod) {
  try {
    await axios.delete(`http://localhost:3000/api/estoque/${cod}`);
    this.fetchProdutos(); // Atualiza a lista após a remoção
    alert('Produto removido com sucesso!');
  } catch (error) {
    console.error('Erro ao remover o produto:', error);
    alert('Erro ao remover o produto.');
  }
},
    editProduct(produto) {
      this.selectedProduct = { ...produto }; // Copia os dados do produto
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedProduct = null; // Limpa o produto selecionado
    },
    async updateProduct(produtoAtualizado) {
      try {
        await axios.put(`http://localhost:3000/api/estoque/${produtoAtualizado.cod}`, produtoAtualizado);
        this.fetchProdutos();
        this.closeEditModal();
        alert('Produto atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar o produto:', error.response ? error.response.data : error.message);
        alert('Erro ao atualizar o produto.');
      }
    }
  },
  created() {
    this.fetchProdutos();
  },
  watch: {
  searchTerm() {
    this.fetchProdutos(); // Chama a função de busca a cada alteração no searchTerm
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