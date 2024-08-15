<template>
  <div class="main"></div>
  <div class="botao">
    <button id="new">Novo Produto</button>
  </div>

  <div class="option-selectores">
    <button id="geral-button">Geral</button>
    <button id="lower-button">Baixo Estoque</button>
    <button id="valid-button">Validade</button>
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
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'EstoqueView',
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

#geral-button {
  position: fixed;
  left: 265px;
  top: 157px;
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

#geral-button:hover {
  background-color: #fff;
  color: black;
  top: 150px;
}

#lower-button {
  position: fixed;
  left: 400px;
  top: 157px;
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

#lower-button:hover {
  background-color: #fff;
  color: black;
  top: 150px;
}

#valid-button {
  position: fixed;
  left: 614px;
  top: 157px;
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

#valid-button:hover {
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
</style>
