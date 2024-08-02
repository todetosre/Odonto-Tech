<template>
  <div>
    <NavBar />
    <div class="content">
      <h1>Welcome to OdontoTech</h1>
      <p>This is the home page of your Vue.js application.</p>
      <button @click="fetchUsers">Fetch Users</button>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import api from '../services/api';

export default {
  name: 'HomeView',
  components: {
    NavBar
  },
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
.content {
  margin-left: 220px;
  /* Deve corresponder à largura da navbar + padding */
  padding: 20px;
}
</style>
