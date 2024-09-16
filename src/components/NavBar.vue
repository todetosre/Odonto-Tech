<template>
  <nav class="navbar">
    <ul class="navbar-content">
      <!-- Adicione @click="redirectToHome" ao elemento img -->
      <img src="./icons/Main.png" alt="Dente-NavBar" class="navbar-logo" @click="redirectToHome">
      <header class="navbar-title">OdontoTech</header>
      <!-- Nome do usuário logado -->
      <header class="navbar-user" @click="redirectToHome">Bem-Vindo(a), {{ nomeUsuario }}</header>
      
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
            class="navbar-icon">Gerenciar Pacientes</router-link></li>
      <li><router-link to="/consultas"><img src="../components/icons/agenda.png" alt="icon-consultas"
            class="navbar-icon">Consultas</router-link></li>
      <li><router-link to="/financeiro"><img src="../components/icons/sinal-de-dolares.png" alt="icon-financeiro"
            class="navbar-icon">Financeiro</router-link></li>
      <li><router-link to="/estoque"><img src="../components/icons/caixa.png" alt="icon-estoque"
            class="navbar-icon">Estoque</router-link></li>
      <li><router-link to="/clinica"><img src="../components/icons/computador.png" alt="icon-clinica"
            class="navbar-icon">Clínica</router-link></li>
      <li @click="logout"><router-link><img src="../components/icons/logout.png" alt="icon-clinica" class="navbar-icon">Sair</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      submenuVisible: false,
      userMenuVisible: false, // Controle de visibilidade do menu de usuário
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
    },
    toggleUserMenu() {
      this.userMenuVisible = !this.userMenuVisible; // Alterna a visibilidade do menu de usuário
    },
    logout() {
      // Remove o nome do usuário do localStorage e redireciona para a tela de login
      localStorage.removeItem('nomeUsuario');
      this.userMenuVisible = false;
      this.$router.push('/');
    },
    redirectToHome() {
      // Redireciona para a página home
      this.$router.push('/home')
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
  background-color: #08396b;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
}

.navbar-content {
  position: relative;
  top: 190px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-title {
  position: relative;
  top: -50px;
  left: 43px;
  font-size: 20px;
  color: white;
  cursor: default;
}

.navbar-user {
  position: relative;
  top: -50px;
  left: 20px;
  font-size: 13px;
  color: white;
  cursor: pointer;
}

.user-menu {
  position: absolute;
  top: 20px; /* Ajuste conforme necessário */
  left: 150px;
  background-color: white;
  color: black;
  list-style: none;
  padding: 2px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.user-menu li {
  padding: 5px;
  cursor: pointer;
}

.user-menu li:hover {
  background-color: #f0f0f0;
}

.navbar li {
  padding-bottom: 5px;
  border-bottom: 3px solid white;
}

.navbar li a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 10px 0;
}

.navbar li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-logo {
  position: absolute;
  top: -180px;
  left: 35px;
  width: 130px;
  height: auto;
  filter: invert(100%) brightness(2);
  cursor: pointer; /* Adiciona o cursor de ponteiro */
}

.navbar-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
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
