<template>
  <div class="relatorio-historico-container">
    <div class="relatorio-historico">
      <h2>Histórico de Procedimentos - {{ pacienteNome }}</h2>

      <!-- Tabela para exibir os dados -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Procedimento</th>
            <th>Dentista</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="procedimento in dadosHistorico" :key="procedimento.id">
            <td>{{ procedimento.id }}</td>
            <td>{{ new Date(procedimento.data).toLocaleDateString() }}</td>
            <td>{{ procedimento.horario }}</td>
            <td>{{ procedimento.procedimento }}</td>
            <td>{{ procedimento.dentista }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Botão para salvar como PDF -->
      <button @click="gerarPDF">Salvar como PDF</button>
    </div>
  </div>
</template>


<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'RelatorioHistoricoPaciente',
  props: ['pacienteId', 'pacienteNome'],
  data() {
    return {
      dadosHistorico: []
    };
  },
  methods: {
    async fetchHistorico() {
      try {
        const response = await fetch(`http://localhost:3000/api/consultas/paciente/${this.pacienteId}`);
        const data = await response.json();

        if (response.ok) {
          this.dadosHistorico = data;
        } else {
          alert(data.message || 'Erro ao buscar procedimentos.');
        }
      } catch (error) {
        console.error('Erro ao buscar histórico do paciente:', error);
      }
    },
    gerarPDF() {
      const doc = new jsPDF();

      // Título do relatório
      doc.setFontSize(18);
      doc.text(`Histórico de Procedimentos - ${this.pacienteNome}`, 14, 20);

      // Configurar colunas e linhas da tabela
      const colunas = ['ID', 'Data', 'Horário', 'Procedimento', 'Dentista'];
      const linhas = this.dadosHistorico.map(procedimento => [
        procedimento.id,
        new Date(procedimento.data).toLocaleDateString(),
        procedimento.horario,
        procedimento.procedimento,
        procedimento.dentista
      ]);

      // Gerar a tabela no PDF
      doc.autoTable({
        startY: 30,
        head: [colunas],
        body: linhas,
      });

      // Salvar o PDF
      doc.save(`historico_${this.pacienteNome}.pdf`);
    }
  },
  mounted() {
    this.fetchHistorico();
  }
};
</script>

<style scoped>
.relatorio-historico-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 60px; /* Ajuste conforme a altura da navbar */
  background-color: #f5f5f5;
  width: 100%;
}

.relatorio-historico {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
  margin: 0 20px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  font-size: 15px;
}

th {
  background-color: #f0f0f0;
  color: #333;
}

td {
  background-color: #fff;
}

button {
  padding: 12px 24px;
  background-color: #08396b;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #072b50;
}

button:active {
  background-color: #061f3b;
}
</style>
