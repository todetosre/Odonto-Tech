<template>
    <nav class="navbar">
      <ul>
        <li><router-link to="/home">Home</router-link></li>
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
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: #333;
    padding-top: 20px;
  }
  
  .navbar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .navbar ul li {
    padding: 8px 16px;
    text-align: left;
  }
  
  .navbar ul li a {
    color: white;
    text-decoration: none;
    display: block;
  }
  
  .navbar ul li a:hover {
    background-color: #575757;
  }
  </style>
  