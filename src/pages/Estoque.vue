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
        <input type="search" placeholder="Buscar Produto">
        <button class="search-button">
          <img src="../components/icons/lupa.png" alt="lupa-icon">
        </button>
      </div>

      <div class="geral-bar">
        <header>Cód.</header>
        <header>Produto</header>
        <header>Categoria</header>
        <header>Quantidade</header>
        <header>Ação</header>
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

        <button type="submit">Salvar</button>
        <button type="button" @click="closeModal">Cancelar</button>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'EstoqueView',
  components: {
    NavBar
  },
  data() {
    return {
      activeButton: '',
      showModal: false,
      produtos: [],
      newProduct: {
        cod: '',
        produto: '',
        categoria: '',
        qtd: '',
        datvalidade: ''
      }
    };
  },
  methods: {
    setActiveButton(button) {
      this.activeButton = button;
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
        cod: null,
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
}
,
    async fetchProdutos() {
      try {
        const response = await axios.get('http://localhost:3000/api/estoque');
        this.produtos = response.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Erro ao buscar produtos.');
      }
    },
    async removerProduto(id) {
      try {
        await axios.delete(`http://localhost:3000/api/estoque/${id}`);
        this.fetchProdutos();
        alert('Produto removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover o produto:', error);
        alert('Erro ao remover o produto.');
      }
    }
  },
  created() {
    this.fetchProdutos();
  }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

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

#new {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 15px 40px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#new:hover {
  background-color: #fff;
  color: #08396b;
}

#new:active {
  background: #08396b;
  top: 2px;
  color: #fff;
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
}

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

.geral-bar {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  background-color: rgb(216, 216, 216);
  position: absolute;
  top: 50px;
  left: 10px;
  width: 1060px;
  height: 500px;
}

header {
  color: black;
  font-weight: bold;
  margin-right: 50px;
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
  width: 300px;
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
  margin-right: 5px;
  padding: 8px 15px;
  cursor: pointer;
}
</style>
