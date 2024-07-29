import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue' //Import da tela Principal
import Cadastros from '../pages/Cadastros.vue' //Import da tela de cadastros
import CadastroF from '../pages/CadastroF.vue' //Import da tela de cadastros de Funcionários
import CadastroP from '../pages/CadastroP.vue' //Import da tela de cadastros de Pacientes
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
    path: '/cadastros',
    name: 'Cadastros',
    component: Cadastros,
    meta: { requiresNavBar: true }
  },
  {
    path: '/cadastros-funcionarios',
    name: 'CadastroF',
    component: CadastroF,
    meta: { requiresNavBar: true }
  },
  {
    path: '/cadastros-pacientes',
    name: 'CadastroP',
    component: CadastroP,
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
