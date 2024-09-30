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
      <div class="entrada">
        <div class="info">
          <img src="../components/icons/grafico-para-cima.png" alt="Entradas" style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(48%) sepia(96%) saturate(450%) hue-rotate(81deg) brightness(95%) contrast(85%);">
          <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Entradas</header>
          <header style="color: green; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
        </div>
      </div>

      <div class="saida">
        <img src="../components/icons/grafico-para-baixo.png" alt="Saídas" style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(26%) sepia(83%) saturate(7483%) hue-rotate(355deg) brightness(97%) contrast(101%);">
        <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Saídas</header>
        <header style="color: red; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
      </div>
      
      <div class="caixa">
        <img src="../components/icons/salvando.png" alt="Caixa" style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(23%) sepia(81%) saturate(3570%) hue-rotate(190deg) brightness(98%) contrast(95%);">
        <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Caixa</header>
        <header style="color: blue; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
      </div>
    </div>

      <!-- Filtros -->
      <div class="filter">
      <div class="month">
        <header style="font-size: 20px">Mês</header> 
        <select id="mes">
          <option value="all">-</option>
          <option value="janeiro">Janeiro</option>
          <option value="fevereiro">Fevereiro</option>
          <option value="março">Março</option>
          <option value="abril">Abril</option>
          <option value="maio">Maio</option>
          <option value="junho">Junho</option>
          <option value="julho">Julho</option>
          <option value="agosto">Agosto</option>
          <option value="setembro">Setembro</option>
          <option value="outubro">Outubro</option>
          <option value="novembro">Novembro</option>
          <option value="dezembro">Dezembro</option>
        </select>
      </div>

      <div class="separator separator1"></div>

      <div class="year">
        <header style="font-size: 20px">Ano</header>
        <select id="ano">
          <option value="all">-</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>

      <div class="separator separator2"></div>

      <div class="dent">
        <header style="font-size: 20px">Dentista</header>
        <select id="dentista">
          <option value="all">-</option>
          <option value="fulano">Fulano</option>
          <option value="sicrano">Sicrano</option>
          <option value="deltrano">Deltrano</option>
        </select>
      </div>

      <div class="separator separator3"></div>

      <div class="action">
        <header style="font-size: 20px">Ação</header>
        <select id="acao">
          <option value="all">-</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>
    </div>

      <!-- Movimentações -->
      <div class="geral-bar">
        <div class="header">
          <span style="position: fixed; left: 300px;">#</span>
          <span style="position: fixed; left: 350px;">Movimentação</span>
          <span style="position: fixed; left: 780px;">Quantidade/Ação</span>
          <span></span>
          <span style="position: fixed; left: 1350px;">Valor</span>
        </div>
      </div>
  </div>

    <!-- Modal de Nova Movimentação -->
    <NovaMoviment :isVisible="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import NovaMoviment from '@/components/NovaMoviment.vue'; // Importe o modal

export default {
  name: 'FinanceiroView',
  components: {
    NavBar,
    NovaMoviment, // Declare o modal como componente
  },
  data() {
    return {
      showModal: false, // Controle de visibilidade do modal
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
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
.geral-bar {
  flex-direction: column;
  padding: 10px;
  background-color: rgb(216, 216, 216);
  position: fixed;
  top: 325px;
  left: 257px;
  width: 1270px;
  height: 400px;
  overflow-y: auto;
}

/* Estilos do header fixo */
.header {
  display: grid;
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

.header {
  display: flex;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 20px;
}
</style>