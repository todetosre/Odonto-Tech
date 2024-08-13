<template>
  <div class="main"></div>
  <div class="botao">
    <button id="new">Novo Produto</button>
  </div>

  <div class="option-selectores">
    <button
      :style="getButtonStyle('geral')"
      id="geral-button"
      @click="selectButton('geral')"
    >Geral</button>
    
    <button
      :style="getButtonStyle('lower')"
      id="lower-button"
      @click="selectButton('lower')"
    >Baixo Estoque</button>
    
    <button
      :style="getButtonStyle('valid')"
      id="valid-button"
      @click="selectButton('valid')"
    >Validade</button>
  </div>

  <div class="geral-bar">
    <div class="buscar">
      <div class="search-bar">
        <input type="search" placeholder="Buscar Produto">
        <button class="search-button">
          <img src="../components/icons/lupa.png" alt="lupa-icon">
        </button>
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
  },
  data() {
    return {
      selectedButton: 'geral', // Inicialmente, seleciona o botão "Geral"
    };
  },
  methods: {
    selectButton(button) {
      this.selectedButton = button;
    },
    getButtonStyle(button) {
      return {
        backgroundColor: this.selectedButton === button ? '#fff' : 'rgb(216, 216, 216)',
        color: this.selectedButton === button ? 'black' : 'black',
        border: '1px solid black',
        cursor: 'pointer',
        padding: '13px 40px',
        fontSize: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '700',
        outline: 'none',
        transition: 'all 0.3s',
        position: 'fixed',
        top: '150px',
        left: button === 'geral' ? '265px' : button === 'lower' ? '398px' : '610px',
      };
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.main{
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
  background: blue;
  color: #fff;
  border-color: blue;
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
  color: blue;
}
#new:active {
  background: blue;
  top: 2px;
  color: #fff;
}
#new:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}
#new:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}

.geral-bar{
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
  margin-left: 800px;
  margin-top: 4px;
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
</style>
