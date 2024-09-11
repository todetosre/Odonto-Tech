import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomeView.vue';
import Cadastros from '../pages/Cadastros.vue';
import CadastroF from '../pages/CadastroF.vue';
import CadastroP from '../pages/CadastroP.vue';
import Estoque from '../pages/Estoque.vue';
import Login from '../pages/Login.vue';
import Pacientes from '../pages/Pacientes.vue';
import Consultas from '../pages/Consultas.vue';
import Financeiro from '../pages/Financeiro.vue';
import Clinica from '../pages/Clinica.vue';
import ClinicaF from '../pages/ClinicaF.vue';
import ClinicaP from '../pages/ClinicaP.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastros',
    name: 'Cadastros',
    component: Cadastros,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastro-funcionarios',
    name: 'CadastroF',
    component: CadastroF,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/cadastro-pacientes',
    name: 'CadastroP',
    component: CadastroP,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/estoque',
    name: 'Estoque',
    component: Estoque,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
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
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/financeiro',
    name: 'Financeiro',
    component: Financeiro,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica',
    name: 'Clinica',
    component: Clinica,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica-funcionario',
    name: 'ClinicaF',
    component: ClinicaF,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
  {
    path: '/clinica-paciente',
    name: 'ClinicaP',
    component: ClinicaP,
    meta: { requiresAuth: true, requiresNavBar: true, title: 'OdontoTech' }
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

// Adicione a guarda de navegação global
router.beforeEach((to, from, next) => {
  // Verifica se a rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifica se o usuário está autenticado (verifica se o token existe)
    const token = localStorage.getItem('token');
    if (token) {
      next();
    } else {
      next({ path: '/' });
    }
  } else {
    next();
  }
});
export default router;