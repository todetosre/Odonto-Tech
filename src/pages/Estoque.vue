<template>
  <div>
    <NavBar />
    <div class="content">
      <h1>Estoque</h1>
      <p>Conteúdo da página de estoque.</p>
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

.content {
  margin-left: 220px;
  /* Deve corresponder à largura da navbar + padding */
  padding: 20px;
}
</style>
