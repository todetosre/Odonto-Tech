import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue' //Import da tela Principal
import Estoque from '../pages/Estoque.vue' //Import da tela de Estoque
import Login from '../pages/Login.vue' //Import da tela de login
import Pacientes from '../pages/Pacientes.vue' //Import da tela de pacientes
import Consultas from '../pages/Consultas.vue' //Import da tela de consultas
import Financeiro from '../pages/Financeiro.vue' //Import da tela do financeiro
import Clinica from '../pages/Clinica.vue' //Import da tela da clínica

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresNavBar: true }
  },
  {
    path: '/estoque',
    name: 'Estoque',
    component: Estoque,
    meta: { requiresNavBar: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresNavBar: false }
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
    meta: { requiresNavBar: true }
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas,
    meta: { requiresNavBar: true }
  },
  {
    path: '/financeiro',
    name: 'Financeiro',
    component: Financeiro,
    meta: { requiresNavBar: true }
  },
  {
    path: '/clinica',
    name: 'Clinica',
    component: Clinica,
    meta: { requiresNavBar: true }
  },
]

const router = createRouter({
  history: createWebHistory('/'),  // Use '/' diretamente
  routes
})

export default router
