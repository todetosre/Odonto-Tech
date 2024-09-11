<template>
  <nav class="navbar">
    <ul class="navbar-content">
      <img src="./icons/Main.png" alt="Dente-NavBar" class="navbar-logo">
      <header class="navbar-title">OdontoTech</header>
      <!-- Substitua o "@" pelo nome do usuário -->
      <header class="navbar-user">Bem-Vindo(a), {{ nomeUsuario }}</header>
      <li></li>
      <li class="navbar-item" @click="toggleSubmenu">
        <div class="navbar-link">
          <img src="../components/icons/sorriso.png" alt="icon-cadastro" class="navbar-icon">Cadastro
        </div>
      </li>
      <transition name="slide-fade">
        <ul v-if="submenuVisible">
          <li><router-link to="/cadastro-funcionarios"><img src="../components/icons/do-utilizador.png"
                alt="icon-funcionarios" class="navbar-icon">Funcionários</router-link></li>
          <li><router-link to="/cadastro-pacientes"><img src="../components/icons/carteira-de-identidade.png"
                alt="icon-pacientes" class="navbar-icon">Pacientes</router-link></li>
        </ul>
      </transition>
      <li><router-link to="/pacientes"><img src="../components/icons/pessoas.png" alt="icon-pacientes"
            class="navbar-icon">Pacientes</router-link></li>
      <li><router-link to="/consultas"><img src="../components/icons/agenda.png" alt="icon-consultas"
            class="navbar-icon">Consultas</router-link></li>
      <li><router-link to="/financeiro"><img src="../components/icons/sinal-de-dolares.png" alt="icon-financeiro"
            class="navbar-icon">Financeiro</router-link></li>
      <li><router-link to="/estoque"><img src="../components/icons/caixa.png" alt="icon-estoque"
            class="navbar-icon">Estoque</router-link></li>
      <li><router-link to="/clinica"><img src="../components/icons/computador.png" alt="icon-clinica"
            class="navbar-icon">Clínica</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      submenuVisible: false,
      nomeUsuario: '' // Campo para armazenar o nome do usuário
    }
  },
  created() {
    // Recupera o nome do usuário do localStorage quando o componente é criado
    this.nomeUsuario = localStorage.getItem('nomeUsuario') || 'Usuário'; // Padrão 'Usuário' se não houver nome
  },
  methods: {
    toggleSubmenu() {
      this.submenuVisible = !this.submenuVisible;
    }
  }
}
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  /* Ajuste conforme necessário */
  background-color: #08396b;
  /* Escolha uma cor de fundo */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  /* Opção para sombra */
  padding: 20px;
  box-sizing: border-box;
  /* Para garantir que o padding seja considerado no tamanho total */
}

.navbar-content {
  position: relative;
  top: 190px;
  /* Ajuste conforme necessário */
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-title {
  position: relative;
  top: -50px;
  left: 43px;
  font-size: 20px;
  text-decoration: none;
  color: white;
  cursor: default;
}

.navbar-user {
  position: relative;
  top: -50px;
  left: 20px;
  font-size: 13px;
  text-decoration: none;
  color: white;
  cursor: default;
}

.navbar li {
  padding-bottom: 5px;
  /* Espaço abaixo do nome */
  margin-bottom: 5px;
  /* Espaço acima da linha */
  border-bottom: 3px solid white;
  /* Linha branca entre os itens */
}

.navbar li a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  /* Ajuste conforme necessário */
  padding: 10px 0;
  /* Ajuste conforme necessário */
}

.navbar li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  /* Efeito de fundo ao passar o mouse */
}

.navbar-logo {
  position: absolute;
  top: -180px;
  left: 35px;
  width: 130px;
  /* Ajuste conforme necessário */
  height: auto;
  /* Mantém a proporção da imagem */
  filter: invert(100%) brightness(2);
  /* Inverte a cor e ajusta o brilho */
}

.navbar-icon {
  width: 20px;
  /* Ajuste conforme necessário */
  height: 20px;
  /* Ajuste conforme necessário */
  margin-right: 10px;
  /* Espaço entre a imagem e o texto */
  filter: invert(100%) brightness(2);
}

.navbar-item {
  position: relative;
  cursor: pointer;
}

.navbar-link {
  display: flex;
  align-items: center;
  color: white;
  padding: 10px 0;
}
</style>
