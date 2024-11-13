<template>
    <!-- Container principal para garantir que o sistema apareça corretamente -->
    <div class="relatorio-procedimentos-container">
      <div class="relatorio-procedimentos">
        <h2>Relatório de Procedimentos Gerais Clínicos</h2>
  
        <!-- Tabela para exibir os dados -->
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Procedimento</th>
              <th>Dentista</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="consulta in consultas" :key="consulta.id">
              <td>{{ consulta.id }}</td>
              <td>{{ consulta.paciente }}</td>
              <td>{{ new Date(consulta.data).toLocaleDateString() }}</td>
              <td>{{ consulta.horario }}</td>
              <td>{{ consulta.procedimento }}</td>
              <td>{{ consulta.dentista }}</td>
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
    data() {
      return {
        consultas: []  // Aqui serão armazenados os dados da API
      };
    },
    methods: {
      async fetchConsultas() {
        try {
          const response = await fetch('http://localhost:3000/api/consultas/procedimentos');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          this.consultas = data;
        } catch (error) {
          console.error('Erro ao buscar consultas:', error);
        }
      },
      gerarPDF() {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Relatório de Procedimentos Gerais Clínicos', 10, 10); // Texto e posição
        const colunas = ['ID', 'Paciente', 'Data', 'Horário', 'Procedimento', 'Dentista'];
        const linhas = this.consultas.map(consulta => [
          consulta.id,
          consulta.paciente,
          new Date(consulta.data).toLocaleDateString(),
          consulta.horario,
          consulta.procedimento,
          consulta.dentista,
        ]);
  
        doc.autoTable({
          head: [colunas],
          body: linhas,
          columnStyles: {
            0: { cellWidth: 15 },   // Coluna ID
            1: { cellWidth: 40 },   // Coluna Paciente
            2: { cellWidth: 30 },   // Coluna Data
            3: { cellWidth: 30 },   // Coluna Horário
            4: { cellWidth: 50 },   // Coluna Procedimento
            5: { cellWidth: 40 }    // Coluna Dentista
          }
        });
  
        doc.save('relatorio-procedimentos.pdf');
      }
    },
    mounted() {
      this.fetchConsultas();  // Buscar dados ao montar o componente
    }
  };
  </script>
  
  <style scoped>
  .relatorio-procedimentos-container {
    display: flex;
    justify-content: center; /* Centraliza o conteúdo horizontalmente */
    align-items: flex-start; /* Alinha no topo, permitindo rolagem se necessário */
    min-height: 100vh; /* Garante que ocupe pelo menos a altura total da tela */
    padding-top: 60px; /* Espaço abaixo da barra de navegação */
    margin-left: 250px;
    background-color: #f5f5f5; /* Cor de fundo suave */
    width: 100%; /* Garante que o conteúdo ocupe toda a largura */
  }
  
  .relatorio-procedimentos {
    background-color: white; /* Fundo branco para o conteúdo do relatório */
    padding: 30px; /* Mais espaço interno */
    border-radius: 12px; /* Bordas arredondadas */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra para destacar o conteúdo */
    max-width: 1200px; /* Limita a largura máxima */
    width: 100%; /* O conteúdo ocupa toda a área disponível */
    margin: 0 20px; /* Margens laterais */
    color: black;
  }
  
  table {
    width: 100%; /* A tabela ocupa toda a largura disponível */
    border-collapse: collapse; /* Remove os espaços entre as bordas da tabela */
    margin-bottom: 30px; /* Espaço abaixo da tabela */
  }
  
  table, th, td {
    border: 1px solid #ddd; /* Bordas discretas */
  }
  
  th, td {
    padding: 12px 15px; /* Espaçamento interno nas células */
    text-align: left; /* Alinhamento do texto à esquerda */
    font-size: 15px; /* Tamanho de fonte legível */
  }
  
  th {
    background-color: #f0f0f0; /* Cor de fundo dos cabeçalhos */
    color: #333; /* Cor do texto dos cabeçalhos */
  }
  
  td {
    background-color: #fff; /* Fundo branco para as células de dados */
  }
  
  button {
    padding: 12px 24px; /* Botões maiores */
    background-color: #08396b; /* Cor de fundo do botão */
    color: white; /* Cor do texto */
    border: none;
    cursor: pointer;
    border-radius: 5px; /* Bordas arredondadas */
    font-size: 16px; /* Tamanho de fonte */
    font-weight: bold; /* Texto em negrito */
    transition: background-color 0.3s ease; /* Efeito de transição ao passar o mouse */
  }
  
  button:hover {
    background-color: #072b50; /* Cor do botão ao passar o mouse */
  }
  
  button:active {
    background-color: #061f3b; /* Cor do botão ao clicar */
  }
  </style>
  