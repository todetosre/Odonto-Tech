<template>
    <div>
      <NavBar />
      <div class="content">
        <h1>Pacientes</h1>
        <p>Conteúdo da página de pacientes.</p>
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
  .content {
    margin-left: 220px; /* Deve corresponder à largura da navbar + padding */
    padding: 20px;
  }
  </style>
  