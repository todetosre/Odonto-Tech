<template>
  <div class="main">
    <div class="botao-relatorios">
      <button id="relatorios">Relatórios</button>
    </div>
    <div class="botao-funcionarios">
      <button id="funcionarios" @click="goToClinicaF">Funcionários</button> <!-- Adicione o evento de clique -->
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
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { Chart } from 'chart.js/auto';

export default {
  name: 'ClinicaView',
  components: {
    NavBar
  },
  methods: {
    goToClinicaF() {
      this.$router.push('/clinica-funcionario'); // Redireciona para a rota especificada
    }
  },
  mounted() {
  // Verificar se o elemento canvas está presente
  const procedimentosCanvas = document.getElementById('procedimentosChart');
  const dentistasCanvas = document.getElementById('dentistasChart');

  if (!procedimentosCanvas || !dentistasCanvas) {
    console.error('Canvas element not found');
    return; // Sai da função se os elementos canvas não forem encontrados
  }

  // Gráfico de Pizza para Procedimentos
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

  // Gráfico de Pizza para Dentistas
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

}
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
</style>