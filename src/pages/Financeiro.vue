<template>
  <div>
    <!-- Barra de ação -->
    <div class="action">
      <div class="action-bar">
        <button @click="showModal = true">Nova Movimentação</button>
      </div>
    </div>

    <!-- Barra de movimentação -->
    <div class="moviment">
      <div class="moviment-bar">
        <!-- Entradas -->
        <div class="entrada">
          <div class="info">
            <img src="../components/icons/grafico-para-cima.png" alt="Entradas" class="icon">
            <header class="header-title">Entradas</header>
            <header class="header-value" style="color: green;">$00,00</header>
          </div>
        </div>

        <!-- Saídas -->
        <div class="saida">
          <img src="../components/icons/grafico-para-baixo.png" alt="Saídas" class="icon">
          <header class="header-title">Saídas</header>
          <header class="header-value" style="color: red;">$00,00</header>
        </div>

        <!-- Caixa -->
        <div class="caixa">
          <img src="../components/icons/salvando.png" alt="Caixa" class="icon">
          <header class="header-title">Caixa</header>
          <header class="header-value" style="color: blue;">$00,00</header>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filter">
        <div class="month">
          <header>Mês</header> 
          <select id="mes">
            <!-- Options de meses aqui -->
          </select>
        </div>
        <div class="separator"></div>
        <div class="year">
          <header>Ano</header>
          <select id="ano">
            <!-- Options de anos aqui -->
          </select>
        </div>
        <div class="separator"></div>
        <div class="dent">
          <header>Dentista</header>
          <select id="dentista">
            <!-- Options de dentistas aqui -->
          </select>
        </div>
        <div class="separator"></div>
        <div class="action">
          <header>Ação</header>
          <select id="acao">
            <!-- Options de ações aqui -->
          </select>
        </div>
      </div>

      <!-- Movimentações -->
      <div class="geral-bar">
        <div class="header">
          <span style="position: fixed; left: 300px; text-align: center;">#</span>
          <span style="position: fixed; left: 350px;">Movimentação</span>
          <span style="position: fixed; left: 780px;">Quantidade/Descrição</span>
          <span></span>
          <span style="position: fixed; left: 1380px;">Valor</span>
        </div>

        <!-- Loop de movimentações -->
<!-- Loop de movimentações -->
<div class="moviment-row" 
     v-for="(moviment, index) in movimentacoes" 
     :key="index" 
     @click="editMoviment(moviment)">
  
  <!-- Índice da movimentação -->
  <span style="position: fixed; left: 300px; text-align: center;">
    {{ index + 1 }}
  </span>
  
  <!-- Referência da movimentação -->
  <span style="position: fixed; left: 350px;">
    {{ moviment.referencia }}
  </span>

  <!-- Exibir a quantidade e item, se existirem -->
  <span v-if="moviment.qtd && moviment.item" style="position: fixed; left: 780px;">
    {{ moviment.qtd }} - {{ moviment.item }}
  </span>

  <!-- Caso contrário, exibe o procedimento -->
  <span v-else style="position: fixed; left: 780px;">
    {{ moviment.procedimento }}
  </span>
  
  <!-- Valor da movimentação -->
  <span style="position: fixed; left: 1370px;">
    R$ {{ moviment.valor }}
  </span>
</div>

        <!-- Modal de Nova Movimentação -->
        <EditarMoviment :isVisible="editModal" :movimentData="selectedMoviment" @close="editModal = false" @update="fetchMovimentacoes" @delete="fetchMovimentacoes"/>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import NovaMoviment from '@/components/NovaMoviment.vue'; // Importe o modal
import axios from 'axios'; // Certifique-se de que o axios está instalado
import EditarMoviment from '@/components/EditarMoviment.vue';

export default {
  name: 'FinanceiroView',
  components: {
    NavBar,
    NovaMoviment,
    EditarMoviment,
  },
  data() {
    return {
      showModal: false,
      editModal: false,
      movimentacoes: [], // Inicializa como um array vazio
      selectedMoviment: null,
    };
  },
  mounted() {
    this.fetchMovimentacoes();
    console.log(this.movimentacoes); // Adicione esta linha
  },
  methods: {
    async fetchMovimentacoes() {
      try {
        const response = await axios.get('http://localhost:3000/api/financeiro');
        console.log(response.data); // Loga todo o array
        response.data.forEach(moviment => {
          console.log(moviment.qtd, moviment.item); // Loga especificamente qtd e item
        });
        this.movimentacoes = response.data;
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    },
    editMoviment(moviment) {
      this.selectedMoviment = moviment;
      this.editModal = true;
    },
    updateMoviment(updatedMoviment) {
      const index = this.movimentacoes.findIndex(
        (moviment) => moviment.id === updatedMoviment.id
      );
      if (index !== -1) {
        this.movimentacoes.splice(index, 1, updatedMoviment);
      }
    },
    async deleteMoviment(moviment) {
    try {
      await axios.delete(`http://localhost:3000/api/financeiro/${moviment.id}`);
      this.movimentacoes = this.movimentacoes.filter(m => m.id !== moviment.id);
      this.editModal = false;
    } catch (error) {
      console.error('Erro ao excluir movimentação:', error);
    }
  },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.index {
  position: relative;
  left: 5px;
  text-align: center;
  width: 50px; /* Ajuste o tamanho conforme necessário */
}


.action-bar {
  position: fixed;
  top: 0px;
  left: 250px;
  width: 100vw;
  background: #fff;
  border: 1px solid black;
}

.action-bar button {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 7px 15px;
  display: inline-block;
  margin: 3px 30px;
  margin-left: 1030px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

.action-bar button:hover {
  background-color: #fff;
  color: #08396b;
}

.action-bar button.active {
  background-color: #fff;
  color: #08396b;
}

.action-bar button:active {
  background-color: #08396b;
  top: 2px;
}

.moviment-bar{
  position: fixed;
  top: 55px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197); /* Cor de fundo da barra */
  cursor: default;
}

.entrada{
  position: fixed;
  margin-top: 10px;
  margin-left: 10px;
  width: 250px;
  height: 110px;
  background-color: white;
}
.saida{
  position: fixed;
  margin-top: 10px;
  margin-left: 500px;
  width: 250px;
  height: 110px;
  background-color: white;
}
.caixa{
  position: fixed;
  margin-top: 10px;
  margin-left: 1010px;
  width: 250px;
  height: 110px;
  background-color: white;
}

.filter{
  position: fixed;
  top: 190px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197); /* Cor de fundo da barra */
  cursor: default;
}

.mov{
  position: absolute;
  top: 325px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197); /* Cor de fundo da barra */
  cursor: default;
}

.month{
  position: absolute;
  top: 20px;
  left: 20px; 
  color: black;
}
.year{
  position: absolute;
  top: 20px;
  left: 400px;
  color: black;
}
.dent{
  position: absolute;
  top: 20px;
  left: 750px;
  color: black;
}
.action{
  position: absolute;
  top: 20px;
  left: 1100px;
  color: black;
}

.separator1 {
  position: absolute;
  top: 20px;
  left: 260px;
  height: 80px;
  width: 1px;
  background-color: black;
}
.separator2 {
  position: absolute;
  top: 20px;
  left: 600px;
  height: 80px;
  width: 1px;
  background-color: black;
}
.separator3 {
  position: absolute;
  top: 20px;
  left: 960px;
  height: 80px;
  width: 1px;
  background-color: black;
}

/* Estilos da barra geral */
.moviment-row {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr; /* Ajuste conforme necessário para o conteúdo */
  align-items: center;
  gap: 0px;
  padding: 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  justify-items: center; /* Centraliza o conteúdo de cada coluna */
}

.geral-bar {
  flex-direction: column;
  padding: 1px;
  background-color: rgb(216, 216, 216);
  position: fixed;
  top: 325px;
  left: 257px;
  width: 1270px;
  height: 400px;
  overflow-y: auto;
  color: black;
}

.header {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr; /* Correspondente à estrutura da row */
  font-weight: bold;
  background-color: #f1f1f1;
  padding: 20px;
  color: black;
  border-bottom: 1px solid #ccc;
  justify-items: center; /* Centraliza horizontalmente cada célula do grid */
  align-items: center;   /* Centraliza verticalmente cada célula do grid */
  text-align: center;    /* Centraliza o texto dentro dos spans */
}

.icon {
  position: absolute;
  width: 30%;
  left: 20px;
  top: 15px;
}

.header-title {
  position: absolute;
  left: 120px;
  top: 20px;
  font-size: 20px;
  color: black;
}

.header-value {
  position: absolute;
  left: 120px;
  top: 50px;
  font-size: 20px;
}

.moviment-item {
  display: grid;
  grid-template-columns: 2fr 9fr 12fr 3fr;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.geral-bar .header {
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 2fr;
  font-weight: bold;
}
</style>