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
      <h3>Opções de Relatórios</h3>
      <ul>
        <li><button @click="emitirRelatorio('financeiro')">Emitir relatório financeiro</button></li>
        <li><button @click="emitirRelatorio('procedimentos')">Emitir relatório de procedimentos gerais clínicos</button></li>
        <li><button @click="emitirRelatorio('historico')">Emitir relatório do histórico de procedimentos dos pacientes</button></li>
        <li><button @click="emitirRelatorio('estoque')">Emitir relatório do estoque</button></li>
        <li><button @click="salvarRelatorio()">Salvar relatório</button></li>
      </ul>
    </div>
  </div>

  <!-- Tabela para exibir os dados financeiros -->
  <div v-if="relatorioGerado">
  <h3>Relatório Financeiro</h3>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Tipo Movimentação</th>
        <th>Referência</th>
        <th>Valor</th>
        <th>Data Movimentação</th>
        <th>Entrada</th>
        <th>Saída</th>
        <th>Caixa</th>
        <th>Procedimento</th>
        <th>Item</th>
        <th>Quantidade</th>
        <th>Usuário</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(linha, index) in relatorioDados" :key="index">
        <td>{{ linha.id }}</td>
        <td>{{ linha.tipomoviment }}</td>
        <td>{{ linha.referencia }}</td>
        <td>{{ linha.valor }}</td>
        <td>{{ new Date(linha.datamoviment).toLocaleDateString() }}</td>
        <td>{{ linha.entrada }}</td>
        <td>{{ linha.saida }}</td>
        <td>{{ linha.caixa }}</td>
        <td>{{ linha.procedimento }}</td>
        <td>{{ linha.item }}</td>
        <td>{{ linha.qtd }}</td>
        <td>{{ linha.usuario }}</td>
      </tr>
    </tbody>
  </table>
  <button @click="gerarPDF">Salvar como PDF</button>
</div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf'; // Biblioteca para geração de PDF
import 'jspdf-autotable'; // Plugin para tabela no PDF

export default {
  name: 'ClinicaView',
  components: {
    NavBar
  },
  data() {
    return {
      showModal: false, // Controle do modal
      relatorioGerado: false, // Controle para exibir ou não o relatório gerado
      relatorioDados: [] // Dados do relatório
    };
  },
  methods: {
    goToClinicaF() {
    this.$router.push('/clinica-funcionario');
  },
  emitirRelatorio(tipo) {
    if (tipo === 'financeiro') {
      this.$router.push('/relatorio-financeiro');  // Redireciona para a nova página de relatório
    }
  },
    gerarPDF() {
      const doc = new jsPDF();
      let colunas = [
        'ID', 'Tipo Movimentação', 'Referência', 'Valor', 'Data Movimentação',
        'Entrada', 'Saída', 'Caixa', 'Procedimento', 'Item', 'Quantidade', 'Usuário'
      ];
      let linhas = [];

      this.relatorioDados.forEach(item => {
        let linha = [
          item.id, item.tipomoviment, item.referencia, item.valor, item.datamoviment,
          item.entrada, item.saida, item.caixa, item.procedimento, item.item, item.qtd, item.usuario
        ];
        linhas.push(linha);
      });

      doc.autoTable({
        head: [colunas],
        body: linhas,
      });

      doc.save('relatorio-financeiro.pdf');
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
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

button {
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #08396b;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #fff;
  color: #08396b;
}
</style>
