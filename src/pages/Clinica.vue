<template>
  <div class="main">
    <div class="botao-relatorios">
      <button id="relatorios" @click="showModal = true">Relatórios</button>
    </div>
    <div class="botao-funcionarios">
      <button id="funcionarios" @click="goToClinicaF">Funcionários</button>
    </div>
  </div>

  <div class="info">
    <div class="graficos">
      <div class="procedimentos">
        <canvas id="procedimentosChart"></canvas>
      </div>
      <div class="dentistas">
        <canvas id="dentistasChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Modal para opções de relatórios -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModal = false">&times;</span>
      <h3>Selecionar Relatório</h3>
      <select v-model="tipoRelatorioSelecionado">
        <option value="financeiro">Relatório Financeiro</option>
        <option value="procedimentos">Relatório de Procedimentos</option>
        <option value="historico">Histórico de Procedimentos dos Pacientes</option>
        <option value="estoque">Relatório de Estoque</option>
      </select>

      <!-- Exibir a lista de pacientes apenas quando houver texto no campo de busca -->
<div v-if="tipoRelatorioSelecionado === 'historico'">
  <input 
    type="text" 
    placeholder="Buscar paciente por nome" 
    v-model="filtroNomePaciente" 
    @input="filtrarPacientes" 
  />
  <ul v-if="filtroNomePaciente">
    <li v-for="paciente in pacientesFiltrados" :key="paciente.id">
      <label>
        <input 
          type="radio" 
          name="paciente" 
          :value="paciente.id" 
          v-model="pacienteSelecionado"
        />
        {{ paciente.nome }}
      </label>
    </li>
  </ul>
</div>

      <!-- Botão para gerar o relatório -->
      <button @click="gerarRelatorio">Gerar Relatório</button>

      <!-- Botão para fechar o modal -->
      <button @click="showModal = false">Fechar</button> <!-- Botão de fechar adicionado -->
    </div>
  </div>
</template>


<script>
import NavBar from '@/components/NavBar.vue';
import { Chart } from 'chart.js/auto';

export default {
  name: 'ClinicaView',
  components: {
    NavBar
  },
  data() {
    return {
      showModal: false, // Controle do modal
      tipoRelatorioSelecionado: '', // Guarda o tipo de relatório selecionado
      pacienteSelecionado: null, // Guarda o paciente selecionado para o histórico
      filtroNomePaciente: '', // Filtro de busca para pacientes
      pacientes: [], // Lista de todos os pacientes
      pacientesFiltrados: [], // Lista filtrada de pacientes para exibir
    };
  },
  methods: {
    goToClinicaF() {
      this.$router.push('/clinica-funcionario'); // Redireciona para a rota especificada
    },
    async gerarRelatorio() {
  if (this.tipoRelatorioSelecionado === 'historico' && this.pacienteSelecionado) {
    // Buscar o nome do paciente selecionado
    const paciente = this.pacientes.find(p => p.id === this.pacienteSelecionado);

    if (!paciente) {
      alert('Paciente não encontrado.');
      return;
    }

    // Gerar a URL para o relatório, incluindo os parâmetros
    const url = this.$router.resolve({
      name: 'RelatorioHistoricoPaciente',
      params: {
        pacienteId: this.pacienteSelecionado,
        pacienteNome: paciente.nome
      }
    }).href;

    // Abrir a URL em uma nova aba
    window.open(url, '_blank');
  } else if (this.tipoRelatorioSelecionado) {
    const rotaRelatorio = {
      financeiro: '/relatorio-financeiro',
      procedimentos: '/relatorio-procedimentos',
      estoque: '/relatorio-estoque'
    }[this.tipoRelatorioSelecionado];
    
    if (rotaRelatorio) {
      window.open(rotaRelatorio, '_blank'); // Abre o relatório em uma nova guia
    }
  } else {
    alert('Por favor, selecione um relatório válido.');
  }
},

    async fetchPacientes() {
      try {
        const response = await fetch('http://localhost:3000/api/pacientes');
        const data = await response.json();
        this.pacientes = data;
        this.pacientesFiltrados = data; // Inicialmente todos os pacientes são exibidos
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
      }
    },
    filtrarPacientes() {
      const filtro = this.filtroNomePaciente.toLowerCase();
      this.pacientesFiltrados = this.pacientes.filter(paciente =>
        paciente.nome.toLowerCase().includes(filtro)
      );
    }
  },
  watch: {
    tipoRelatorioSelecionado(newVal) {
      if (newVal === 'historico') {
        // Carregar pacientes quando o relatório "Histórico" for selecionado
        this.fetchPacientes();
      }
    }
  },
  mounted() {
    // Configurações do gráfico (código pré-existente)
    const procedimentosCanvas = document.getElementById('procedimentosChart');
    const dentistasCanvas = document.getElementById('dentistasChart');

    if (!procedimentosCanvas || !dentistasCanvas) {
      console.error('Canvas element not found');
      return;
    }

    const procedimentosCtx = procedimentosCanvas.getContext('2d');
    new Chart(procedimentosCtx, {
      type: 'pie',
      data: {
        labels: ['Obturação', 'Extração', 'Limpeza'],
        datasets: [{
          data: [30, 50, 20],
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    const dentistasCtx = dentistasCanvas.getContext('2d');
    new Chart(dentistasCtx, {
      type: 'pie',
      data: {
        labels: ['Vitor', 'Carlos', 'Neto'],
        datasets: [{
          data: [40, 30, 30],
          backgroundColor: ['#4bc0c0', '#ffcd56', '#ff9f40'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.main {
  position: fixed;
  top: 5px;
  left: 255px;
  background-color: rgb(216, 216, 216);
  width: 1105px;
  height: 900px;
}

.botao-relatorios {
  position: fixed;
  top: 10px;
  left: 1100px;
}

#relatorios {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 15px 40px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#relatorios:hover {
  background-color: #fff;
  color: #08396b;
}

#relatorios:active {
  background: #08396b;
  top: 2px;
  color: #fff;
}

.botao-funcionarios {
  position: fixed;
  top: 10px;
  left: 250px;
}

#funcionarios {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 15px 40px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#funcionarios:hover {
  background-color: #fff;
  color: #08396b;
}

#funcionarios:active {
  background: #08396b;
  top: 2px;
  color: #fff;
}

.info {
  position: fixed;
  top: 100px;
  left: 260px;
  width: 1095px;
  height: 700px;
  background-color: #fff;
}

.graficos {
  display: flex;
  justify-content: space-between;
}

.procedimentos{
  position: relative;
  top: 10px;
  left: 10px;
  height: 400px;
  width: 400px;
  background-color: rgb(216, 216, 216);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dentistas {
  position: relative;
  top: 10px;
  left: -10px;
  height: 400px;
  width: 400px;
  background-color: rgb(216, 216, 216);
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  height: 300px !important;
  width: 300px !important;
}

/* Estilos para o Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 400px; /* Tamanho do popup */
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content ul {
  list-style-type: none;
  padding: 0;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}
</style>