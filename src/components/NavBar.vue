<template>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/estoque">Estoque</router-link></li>
        <!-- Adicione outros links aqui -->
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar'
  }
  </script>
  
  <style scoped>
  /* Estilos para o menu de navegação */
  </style>
  