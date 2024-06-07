<template>

      <nav class="navbar">
      <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/estoque">Estoque</router-link></li>
        <!-- Adicione outros links aqui -->
      </ul>
    </nav>
    <div>

    <h1>Welcome to OdontoTech</h1>
    <p>This is the home page of your Vue.js application.</p>
    <button @click="fetchUsers">Fetch Users</button>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>

</template>

<script>
import api from '../services/api';

export default {
  name: 'HomeView',
  name: 'NavBar',

  data() {
    return {
      users: []
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }
}

</script>

<style scoped>
h1 {
  color: black; /* Ajuste para uma cor visível */
}


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
