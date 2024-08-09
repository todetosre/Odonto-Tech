<template>
  <div class="moviment">
    <div class="moviment-bar">
      <div class="entrada">
        <div class="info">
          <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Entradas</header>
          <header style="color: green; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
        </div>
      </div>
      <div class="saida">
        <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Saídas</header>
        <header style="color: red; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
      </div>
      <div class="caixa">
        <header style="color: black; position: absolute; left: 120px; top: 20px; font-size: 20px;">Caixa</header>
        <header style="color: blue; position: absolute; left: 120px; top: 50px; font-size: 20px;">$00,00</header>
      </div>
    </div>
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
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
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
    <div class="mov">
      <header style="color: black; font-size: 20px; position: absolute; left: 10px;">Movimentações</header>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'FinanceiroView',
  components: {
    NavBar
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.moviment-bar{
  display: fixed;
  margin-top: -320px;
  margin-left: 150px;
  width: 1101px;
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
  margin-left: 420px;
  width: 250px;
  height: 110px;
  background-color: white;
}
.caixa{
  position: fixed;
  margin-top: 10px;
  margin-left: 840px;
  width: 250px;
  height: 110px;
  background-color: white;
}

.filter{
  position: absolute;
  top: 140px;
  left: 257px;
  width: 1101px;
  height: 130px;
  background-color: rgb(197, 197, 197); /* Cor de fundo da barra */
  cursor: default;
}

.mov{
  position: absolute;
  top: 275px;
  left: 257px;
  width: 1101px;
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
  left: 350px;
  color: black;
}
.dent{
  position: absolute;
  top: 20px;
  left: 650px;
  color: black;
}
.action{
  position: absolute;
  top: 20px;
  left: 950px;
  color: black;
}

.separator1 {
  position: absolute;
  top: 20px;
  left: 250px;
  height: 80px;
  width: 1px;
  background-color: black;
}
.separator2 {
  position: absolute;
  top: 20px;
  left: 550px;
  height: 80px;
  width: 1px;
  background-color: black;
}
.separator3 {
  position: absolute;
  top: 20px;
  left: 850px;
  height: 80px;
  width: 1px;
  background-color: black;
}
</style>
