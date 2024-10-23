<template>
  <div>
    <!-- Esta é uma função de utilidade, portanto, não precisa de interface visual -->
  </div>
</template>

<script>
import jsPDF from 'jspdf'; // Biblioteca para geração de PDF
import 'jspdf-autotable'; // Plugin para tabelas no PDF

export default {
  name: 'RelatorioHistoricoPaciente',
  props: ['pacienteId', 'pacienteNome'], // Recebe o ID e o nome do paciente como props
  data() {
    return {
      dadosHistorico: [] // Armazena o histórico de procedimentos do paciente
    };
  },
  methods: {
    // Função para buscar o histórico de procedimentos
    async fetchHistorico() {
      try {
        const response = await fetch(`http://localhost:3000/api/consultas/paciente/${this.pacienteId}`);
        const data = await response.json();

        if (response.ok) {
          this.dadosHistorico = data;
          this.gerarPDFHistorico(this.dadosHistorico, this.pacienteNome);
        } else {
          alert(data.message || 'Erro ao buscar procedimentos.');
        }
      } catch (error) {
        console.error('Erro ao buscar histórico do paciente:', error);
      }
    },
    gerarPDFHistorico(dadosHistorico, nomePaciente) {
      const doc = new jsPDF();

      // Título do relatório
      doc.setFontSize(18);
      doc.text(`Histórico de Procedimentos - ${nomePaciente}`, 14, 20);

      // Configurar colunas e linhas da tabela
      const colunas = ['ID', 'Data', 'Horário', 'Procedimento', 'Dentista'];
      const linhas = dadosHistorico.map(procedimento => [
        procedimento.id,
        new Date(procedimento.data).toLocaleDateString(),
        procedimento.horario,
        procedimento.procedimento,
        procedimento.dentista
      ]);

      // Gerar a tabela no PDF
      doc.autoTable({
        startY: 30, // Posição de início da tabela no PDF
        head: [colunas],
        body: linhas,
      });

      // Salvar o arquivo PDF com o nome do paciente
      doc.save(`historico_${nomePaciente}.pdf`);
    }
  },
  mounted() {
    // Buscar o histórico de procedimentos ao montar o componente
    this.fetchHistorico();
  }
};
</script>