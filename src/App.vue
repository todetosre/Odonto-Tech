<template>
  <div id="app">
    <NavBar v-if="$route.meta.requiresNavBar" />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  display: flex;
}

.content {
  margin-left: 200px; /* Deve corresponder à largura da navbar */
  padding: 20px;
  width: calc(100% - 200px); /* Ajusta a largura da content */
  box-sizing: border-box;
}
</style>
