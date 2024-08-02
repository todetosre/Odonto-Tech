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
  </div>
  <div class="back"
    style="background: rgb(229, 240, 253); position: fixed; top: 0px; left: 250px; width: 1150px; height: 1000px;">
  </div>

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


</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'PacientesView',
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

.content {
  position: fixed;
  top: 30px;
  /* Ajuste conforme necessário */
  left: 450px;
  /* Ajuste conforme a largura da navbar + padding */
  padding: 20px;
  z-index: 1;
  /* Garante que fique acima de outros conteúdos */
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
  /* Linha abaixo da foto */
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

.buscar {
  position: fixed;
  top: 0;
  left: 250px;
  width: 100%;
  height: 40px;
  background: #fff;
  border: 1px solid black;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-top: 4px;
}

.search-button {
  background: none;
  /* Remove a cor de fundo padrão do botão */
  border: none;
  /* Remove a borda padrão do botão */
  cursor: pointer;
  /* Define o cursor como pointer para indicar que é clicável */
  padding: 0;
  /* Remove o padding do botão para ajustar a imagem */
  margin-left: 5px;
  /* Adiciona um espaçamento entre o input e o botão */
}

.search-button img {
  width: 20px;
  /* Ajuste conforme necessário */
  height: 20px;
  /* Ajuste conforme necessário */
  margin-top: 4px
}

.action-bar {
  position: fixed;
  margin-top: -90px;
  margin-left: -380px;
  width: 1074px;
  height: 50px;
  background: #fff;
  border: 1px solid black;
}

#ficha {
  position: fixed;
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  display: inline-block;
  margin: 0 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#ficha:hover {
  background-color: #08396b;
  color: #fff;
}

#ficha:active {
  background-color: #08396b;
  top: 2px;
}

#ficha:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#ficha:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}

#odontograma {
  position: fixed;
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  display: inline-block;
  margin: 0 202px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#odontograma:hover {
  background-color: #08396b;
  color: #fff;
}

#odontograma:active {
  background-color: #08396b;
  top: 2px;
}

#odontograma:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#odontograma:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}

#fotos {
  position: fixed;
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  display: inline-block;
  margin: 0 415px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#fotos:hover {
  background-color: #08396b;
  color: #fff;
}

#fotos:active {
  background-color: #08396b;
  top: 2px;
}

#fotos:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#fotos:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}

#more {
  position: fixed;
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  display: inline-block;
  margin: 0 549px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#more:hover {
  background-color: #08396b;
  color: #fff;
}

#more:active {
  background-color: #08396b;
  top: 2px;
}

#more:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#more:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}
</style>