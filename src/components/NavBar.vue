<template>
  <nav class="navbar">
    <ul class="navbar-content">
      <img src="./icons/Main.png" alt="Dente-NavBar" class="navbar-logo">
      <header class="navbar-title">OdontoTech</header>
      <header class="navbar-user">Bem-Vindo(a), @</header>
      <li></li>
      <li><router-link to="/home">Home</router-link></li>
      <li><router-link to="/home">Pacientes</router-link></li>
      <li><router-link to="/home">Consultas</router-link></li>
      <li><router-link to="/home">Financeiro</router-link></li>
      <li><router-link to="/estoque">Estoque</router-link></li>
      <li><router-link to="/home">Clínica</router-link></li>
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
  height: 100%;
  width: 250px; /* Ajuste conforme necessário */
  background-color: #08396b; /* Escolha uma cor de fundo */
  box-shadow: 2px 0 5px rgba(0,0,0,0.1); /* Opção para sombra */
  padding: 20px;
  box-sizing: border-box; /* Para garantir que o padding seja considerado no tamanho total */
}

.navbar-content {
  position: relative;
  top: 260px; /* Ajuste conforme necessário */
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-title {
  position: relative;
  top: -80px;
  left: 43px;
  font-size: 20px;
  text-decoration: none;
  color: white;
  cursor: default;
}

.navbar-user {
  position: relative;
  top: -70px;
  left: 20px;
  font-size: 13px;
  text-decoration: none;
  color: white;
  cursor: default;
}

.navbar li {
  padding-bottom: 05px; /* Espaço abaixo do nome */
  margin-bottom: 05px; /* Espaço acima da linha */
  border-bottom: 3px solid white; /* Linha branca entre os itens */
}

.navbar li a {
  display: block;
  text-decoration: none;
  color: white; /* Ajuste conforme necessário */
  padding: 10px 0; /* Ajuste conforme necessário */
}

.navbar li a:hover {
  /*color: #007bff; */
  background-color: rgba(255, 255, 255, 0.1); /* Efeito de fundo ao passar o mouse */
}

.navbar-logo {
  position: absolute;
  top: -240px;
  left: 25px;
  width: 150px; /* Ajuste conforme necessário */
  height: auto; /* Mantém a proporção da imagem */
  filter: invert(100%) brightness(2); /* Inverte a cor e ajusta o brilho */
}
</style>
