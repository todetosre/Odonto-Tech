<template>
  <div>
    <NavBar />
    <div class="content">
      <div class="photo-container">
        <div class="photo">
          <img :src="photoUrl" alt="Foto do Funcionário" v-if="photoUrl" />
        </div>
        <div class="photo-buttons">
          <button @click="deletePhoto">Deletar</button>
          <button @click="changePhoto">Alterar</button>
        </div>
      </div>
    </div>
    <div class="back"></div>

    <div class="buscar">
      <div class="search-bar">
        <input type="search" placeholder="Buscar Paciente">
        <button class="search-button">
          <img src="../components/icons/lupa.png" alt="lupa-icon">
        </button>
      </div>
    </div>

    <div class="action">
      <div class="action-bar">
        <button id="ficha">Ficha Clínica</button>
        <button id="odontograma">Odontograma</button>
        <button id="fotos">Fotos</button>
        <button id="more">Outros</button>
      </div>
    </div>

    <div class="odontograma-wrapper">
      <Odontograma />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Odontograma from '@/components/Odontograma.vue';

export default {
  name: 'PacientesView',
  components: {
    NavBar,
    Odontograma
  },
  data() {
    return {
      photoUrl: null  // Supondo que você tenha um photoUrl para a imagem do funcionário
    };
  },
  methods: {
    deletePhoto() {
      // Lógica para deletar foto
      this.photoUrl = null;
    },
    changePhoto() {
      // Lógica para alterar foto
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.content {
  position: fixed;
  top: 30px;
  left: 450px;
  padding: 20px;
  z-index: 2;
}

.photo-container {
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(240, 240, 240);
}

.photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 3px solid black;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-buttons button {
  margin: 5px;
  cursor: pointer;
}

.back {
  background: rgb(229, 240, 253);
  position: fixed;
  top: 0px;
  left: 250px;
  width: 1150px;
  height: 1000px;
  z-index: 1;
}

.buscar {
  position: fixed;
  top: 0;
  left: 250px;
  width: 100%;
  height: 40px;
  background: #fff;
  border: 1px solid black;
  z-index: 2;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-left: 5px;
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

.action {
  position: fixed;
  top: 230px;
  left: 250px;
  width: calc(100% - 250px);
  z-index: 2;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border: 1px solid black;
}

.action-bar button {
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

.action-bar button:hover {
  background-color: #08396b;
  color: #fff;
}

.action-bar button:active {
  background-color: #08396b;
  top: 2px;
}

.odontograma-wrapper {
  position: relative;
  z-index: 3;
  margin-top: 30px;
  padding: 20px;
}
</style>
