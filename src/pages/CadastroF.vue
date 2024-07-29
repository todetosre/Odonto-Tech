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
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'CadastroFView',
  components: {
    NavBar
  },
  data() {
    return {
      photoUrl: '' // URL da foto do funcionário
    }
  },
  methods: {
    deletePhoto() {
      this.photoUrl = ''; // Lógica para deletar a foto
    },
    changePhoto() {
      // Lógica para alterar a foto, como abrir um diálogo para selecionar uma nova foto
    }
  }
}
</script>

<style scoped>
.content {
  margin-left: 220px; /* Deve corresponder à largura da navbar + padding */
  padding: 20px;
}

.photo-container {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-buttons button {
  margin: 5px;
}
</style>
