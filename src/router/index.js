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
import ClinicaF from '../pages/ClinicaF.vue' //Import da tela de tratamento Funcionario
import ClinicaP from '../pages/ClinicaP.vue' //Import da tela de tratamento Paciente
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastros',
    name: 'Cadastros',
    component: Cadastros,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastro-funcionarios',
    name: 'CadastroF',
    component: CadastroF,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastro-pacientes',
    name: 'CadastroP',
    component: CadastroP,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/estoque',
    name: 'Estoque',
    component: Estoque,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresNavBar: false, title: 'Login | OdontoTech' }
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/financeiro',
    name: 'Financeiro',
    component: Financeiro,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica',
    name: 'Clinica',
    component: Clinica,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica-funcionario',
    name: 'ClinicaF',
    component: ClinicaF,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica-paciente',
    name: 'ClinicaP',
    component: ClinicaP,
    meta: { requiresNavBar: true, title: 'OdontoTech' }
  },
]

const router = createRouter({
  history: createWebHistory('/'),  // Use '/' diretamente
  routes
})

export default router
