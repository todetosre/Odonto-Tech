<template>
  <div class="relatorio-financeiro-container">
    <div class="relatorio-financeiro">
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
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'RelatorioFinanceiro',
  data() {
    return {
      relatorioDados: []  // Armazena os dados do relatório financeiro
    };
  },
  methods: {
    async carregarRelatorio() {
      try {
        const response = await fetch('http://localhost:3000/api/relatorio-financeiro');
        const data = await response.json();
        this.relatorioDados = data;  // Preenche os dados do relatório
      } catch (err) {
        console.error('Erro ao carregar o relatório financeiro:', err);
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
    this.carregarRelatorio();  // Carrega os dados ao montar o componente
  }
};
</script>

<style scoped>
.relatorio-financeiro-container {
  display: flex;
  justify-content: center;  /* Centraliza horizontalmente */
  align-items: flex-start;  /* Alinha no topo (abaixo da navbar) */
  min-height: 100vh;  /* Garante que ocupe pelo menos 100% da altura da tela */
  padding-top: 60px;  /* Ajusta esse valor para deixar abaixo da navbar */
  background-color: #f5f5f5;  /* Cor de fundo clara */
}

.relatorio-financeiro {
  background-color: white;  /* Fundo branco para o conteúdo do relatório */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);  /* Sombra para destacar */
  max-width: 1200px;  /* Define uma largura máxima para o conteúdo */
  width: 100%;  /* Faz o conteúdo ocupar 100% da área disponível */
  margin: 0 20px;  /* Margem lateral */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

button {
  padding: 10px 20px;
  background-color: #08396b;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #072b50;
}
</style>
