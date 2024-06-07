import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue' //Import da tela Principal
import Estoque from '../pages/Estoque.vue' //Import da tela de Estoque
import Login from '../pages/Login.vue' //Import da tela de login

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/estoque',
    name: 'Estoque',
    component: Estoque
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // Outras rotas podem ser adicionadas aqui
]

const router = createRouter({
  history: createWebHistory('/'),  // Use '/' diretamente
  routes
})

export default router
