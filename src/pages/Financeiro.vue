<template>
  <div>
    <!-- Barra de ação -->
    <div class="action">
      <div class="action-bar">
        <button @click="showModal = true">Nova Movimentação</button>
      </div>
    </div>

    <!-- Barra de movimentação -->
    <div class="moviment">
      <div class="moviment-bar">

        <!-- Entradas -->
        <div class="entrada">
          <div class="info">
            <img src="../components/icons/grafico-para-cima.png" alt="Entradas" class="icon"
              style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(48%) sepia(96%) saturate(450%) hue-rotate(81deg) brightness(95%) contrast(85%);">
            <header class="header-title">Entradas</header>
            <header class="header-value" style="color: green;">
              R$ {{ ultimaEntrada ? ultimaEntrada.toFixed(2) : '00,00' }}
            </header>
          </div>
        </div>

        <!-- Saídas -->
        <div class="saida">
          <img src="../components/icons/grafico-para-baixo.png" alt="Saídas" class="icon"
            style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(26%) sepia(83%) saturate(7483%) hue-rotate(355deg) brightness(97%) contrast(101%);">
          <header class="header-title">Saídas</header>
          <header class="header-value" style="color: red;">
            R$ {{ ultimaSaida ? ultimaSaida.toFixed(2) : '00,00' }}
          </header>
        </div>

        <!-- Caixa -->
        <div class="caixa">
          <img src="../components/icons/salvando.png" alt="Caixa" class="icon"
            style="position: absolute; width: 30%; left: 20px; top: 15px; filter: invert(23%) sepia(81%) saturate(3570%) hue-rotate(190deg) brightness(98%) contrast(95%);">
          <header class="header-title">Caixa</header>
          <header class="header-value" style="color: blue;">
            R$ {{ saldoCaixa.toFixed(2) }}
          </header>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filter">
        <div class="month">
          <header>Mês</header>
          <select id="mes">
            <!-- Options de meses aqui -->
          </select>
        </div>

        <div class="separator"></div>

        <div class="year">
          <header>Ano</header>
          <select id="ano">
            <!-- Options de anos aqui -->
          </select>
        </div>

        <div class="separator"></div>

        <div class="operation">
          <header>Operação</header>
          <select v-model="selectedOperation">
            <option value="">Todas</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
            <option value="Procedimentos">Procedimentos</option>
          </select>
        </div>

        <div class="separator"></div>

        <div class="responsible">
        <header>Responsável</header>
        <select v-model="selectedResponsible">
          <option value="">Todos</option>
          <option v-for="user in users" :key="user.id" :value="user.nome">
            {{ user.nome }}
          </option>
        </select>
      </div>

      </div>

<!-- Movimentações -->
<div class="geral-bar">
  <div class="header">
    <span style="position: fixed; left: 300px; text-align: center;">#</span>
    <span style="position: fixed; left: 350px;">Movimentação</span>
    <span style="position: fixed; left: 780px;">Quantidade/Descrição</span>
    <span></span>
    <span style="position: fixed; left: 1380px;">Valor</span>
  </div>

  <!-- Exibe a mensagem de "sem movimentações" como uma linha da tabela -->
  <div v-if="filteredMovimentacoes.length === 0" class="moviment-row">
    <span style="grid-column: 1 / span 4; text-align: center;">Não há movimentações feitas por este usuário!</span>
  </div>

        <!-- Loop de movimentações -->
        <div class="moviment-row" v-for="(moviment, index) in filteredMovimentacoes" :key="index" @click="editMoviment(moviment)">

          <!-- Índice da movimentação -->
          <span style="position: fixed; left: 300px; text-align: center;">
            {{ index + 1 }}
          </span>

          <!-- Referência da movimentação -->
          <span style="position: fixed; left: 350px;">
            {{ moviment.referencia }}
          </span>

          <!-- Exibir quantidade e item, se referencia for "Clínica" -->
          <span v-if="moviment.referencia === 'Clínica'" style="position: fixed; left: 780px;">
            {{ moviment.qtd }} - {{ moviment.item }} / {{ moviment.tipomoviment }}
          </span>

          <!-- Caso contrário, exibe o procedimento -->
          <span v-else style="position: fixed; left: 780px;">
            {{ moviment.procedimento }}
          </span>

          <!-- Valor da movimentação -->
          <span style="position: fixed; left: 1370px;">
            R$ {{ moviment.valor }}
          </span>
        </div>
        <!-- Modal de Nova Movimentação -->
        <EditarMoviment :isVisible="editModal" :movimentData="selectedMoviment" @close="editModal = false"
          @update="fetchMovimentacoes" @delete="fetchMovimentacoes" />
        <!-- Modal de Nova Movimentação -->
        <NovaMoviment :isVisible="showModal" @close="showModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import NovaMoviment from '@/components/NovaMoviment.vue'; // Importe o modal
import axios from 'axios'; // Certifique-se de que o axios está instalado
import EditarMoviment from '@/components/EditarMoviment.vue';

export default {
  name: 'FinanceiroView',
  components: {
    NavBar,
    NovaMoviment,
    EditarMoviment,
  },
  data() {
    return {
      showModal: false,
      editModal: false,
      movimentacoes: [],
      saldoCaixa: 0,
      ultimaEntrada: null,
      ultimaSaida: null,
      selectedMoviment: null,
      selectedOperation: '',
      selectedResponsible: '',  // Para o filtro de responsável
      users: [],  // Aqui ficará a lista de usuários
    };
  },
  computed: {
  filteredMovimentacoes() {
    return this.movimentacoes.filter(moviment => {
      // Filtra por tipo de operação, se selecionado
      const matchesOperation = !this.selectedOperation || moviment.tipomoviment === this.selectedOperation;

      // Filtra por usuário, se selecionado
      const movimentUsuario = moviment.usuario ? moviment.usuario.trim().toLowerCase() : '';
      const selectedUsuario = this.selectedResponsible ? this.selectedResponsible.trim().toLowerCase() : '';
      const matchesResponsible = !this.selectedResponsible || movimentUsuario === selectedUsuario;

      return matchesOperation && matchesResponsible;
    });
  }
},
  mounted() {
    Promise.all([
      this.fetchMovimentacoes(),
      this.fetchSaldoCaixa(),
      this.fetchUltimaEntrada(),
      this.fetchUltimaSaida(),
      this.fetchUsers()  // Chama a função para buscar os usuários
    ]).catch(error => {
      console.error('Erro nas chamadas assíncronas:', error);
    });
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    },
    async buscarMovimentacoes() {
      const params = {
        tipo: this.filtroTipo || '',
        referencia: this.filtroReferencia || ''
      };

      try {
        const response = await fetch(`http://localhost:3000/api/financeiro?${new URLSearchParams(params)}`);
        this.movimentacoes = await response.json();
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    },
    async fetchMovimentacoes() {
      try {
        const response = await axios.get('http://localhost:3000/api/financeiro');
        this.movimentacoes = response.data.sort((a, b) => {
          return new Date(a.datamoviment) - new Date(b.datamoviment) || a.id - b.id;
        });
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    },
    editMoviment(moviment) {
      this.selectedMoviment = moviment;
      this.editModal = true;
    },
    updateMoviment(updatedMoviment) {
      const index = this.movimentacoes.findIndex(
        (moviment) => moviment.id === updatedMoviment.id
      );
      if (index !== -1) {
        // Atualiza o item diretamente no array
        this.$set(this.movimentacoes, index, updatedMoviment);
      }
    },
    async deleteMoviment(moviment) {
      try {
        await axios.delete(`http://localhost:3000/api/financeiro/${moviment.id}`);
        this.movimentacoes = this.movimentacoes.filter(m => m.id !== moviment.id);
        this.editModal = false;
        this.fetchSaldoCaixa();  // Atualiza o saldo após exclusão
      } catch (error) {
        console.error('Erro ao excluir movimentação:', error);
      }
    },
    async fetchUltimaEntrada() {
      try {
        const response = await axios.get('http://localhost:3000/api/financeiro/ultima-entrada');
        console.log('Resposta da última entrada:', response.data);

        // Converte o valor para número antes de atribuir
        this.ultimaEntrada = response.data && response.data.valor !== undefined
          ? parseFloat(response.data.valor)  // Usa parseFloat para converter string em número
          : 0; // Valor padrão caso o valor seja indefinido

        console.log('Última entrada (após atribuição):', this.ultimaEntrada);
      } catch (error) {
        console.error('Erro ao buscar última entrada:', error);
      }
    },
    async fetchUltimaSaida() {
      try {
        const response = await axios.get('http://localhost:3000/api/financeiro/ultima-saida');
        console.log('Resposta da última saída:', response.data);

        // Converte o valor para número antes de atribuir
        this.ultimaSaida = response.data && response.data.valor !== undefined
          ? parseFloat(response.data.valor)  // Usa parseFloat para converter string em número
          : 0; // Valor padrão caso o valor seja indefinido

        console.log('Última saída (após atribuição):', this.ultimaSaida);
      } catch (error) {
        console.error('Erro ao buscar última saída:', error);
      }
    },
    async fetchSaldoCaixa() {
      try {
        const response = await axios.get('http://localhost:3000/api/financeiro/caixa');
        this.saldoCaixa = response.data.saldo;
      } catch (error) {
        console.error('Erro ao buscar saldo do caixa:', error);
      }
    },
    async createMoviment() {
      // Após criar a nova movimentação
      await this.fetchMovimentacoes();
      this.fetchSaldoCaixa();  // Atualiza o saldo do caixa
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.index {
  position: relative;
  left: 5px;
  text-align: center;
  width: 50px;
  /* Ajuste o tamanho conforme necessário */
}


.action-bar {
  position: fixed;
  top: 0px;
  left: 250px;
  width: 100vw;
  background: #fff;
  border: 1px solid black;
}

.action-bar button {
  background: #08396b;
  color: #fff;
  border-color: #08396b;
  cursor: pointer;
  font-size: inherit;
  padding: 7px 15px;
  display: inline-block;
  margin: 3px 30px;
  margin-left: 1030px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

.action-bar button:hover {
  background-color: #fff;
  color: #08396b;
}

.action-bar button.active {
  background-color: #fff;
  color: #08396b;
}

.action-bar button:active {
  background-color: #08396b;
  top: 2px;
}

.moviment-bar {
  position: fixed;
  top: 55px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197);
  /* Cor de fundo da barra */
  cursor: default;
}

.entrada {
  position: fixed;
  margin-top: 10px;
  margin-left: 10px;
  width: 250px;
  height: 110px;
  background-color: white;
}

.saida {
  position: fixed;
  margin-top: 10px;
  margin-left: 500px;
  width: 250px;
  height: 110px;
  background-color: white;
}

.caixa {
  position: fixed;
  margin-top: 10px;
  margin-left: 1010px;
  width: 250px;
  height: 110px;
  background-color: white;
}

.filter {
  position: fixed;
  top: 190px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197);
  /* Cor de fundo da barra */
  cursor: default;
}

.mov {
  position: absolute;
  top: 325px;
  left: 257px;
  width: 1270px;
  height: 130px;
  background-color: rgb(197, 197, 197);
  /* Cor de fundo da barra */
  cursor: default;
}

.month {
  position: absolute;
  top: 20px;
  left: 20px;
  color: black;
}

.year {
  position: absolute;
  top: 20px;
  left: 400px;
  color: black;
}

.operation {
  position: absolute;
  top: 20px;
  left: 750px;
  color: black;
}

.responsible {
  position: absolute;
  top: 20px;
  left: 1100px;
  color: black;
}

.separator1 {
  position: absolute;
  top: 20px;
  left: 260px;
  height: 80px;
  width: 1px;
  background-color: black;
}

.separator2 {
  position: absolute;
  top: 20px;
  left: 600px;
  height: 80px;
  width: 1px;
  background-color: black;
}

.separator3 {
  position: absolute;
  top: 20px;
  left: 960px;
  height: 80px;
  width: 1px;
  background-color: black;
}

/* Estilos da barra geral */
.moviment-row {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr;
  /* Ajuste conforme necessário para o conteúdo */
  align-items: center;
  gap: 0px;
  padding: 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  justify-items: center;
  /* Centraliza o conteúdo de cada coluna */
}

.geral-bar {
  flex-direction: column;
  padding: 1px;
  background-color: rgb(216, 216, 216);
  position: fixed;
  top: 325px;
  left: 257px;
  width: 1270px;
  height: 400px;
  overflow-y: auto;
  color: black;
}

.header {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr;
  /* Correspondente à estrutura da row */
  font-weight: bold;
  background-color: #f1f1f1;
  padding: 20px;
  color: black;
  border-bottom: 1px solid #ccc;
  justify-items: center;
  /* Centraliza horizontalmente cada célula do grid */
  align-items: center;
  /* Centraliza verticalmente cada célula do grid */
  text-align: center;
  /* Centraliza o texto dentro dos spans */
}

.icon {
  position: absolute;
  width: 30%;
  left: 20px;
  top: 15px;
}

.header-title {
  position: absolute;
  left: 120px;
  top: 20px;
  font-size: 20px;
  color: black;
}

.header-value {
  position: absolute;
  left: 120px;
  top: 50px;
  font-size: 20px;
}

.moviment-item {
  display: grid;
  grid-template-columns: 2fr 9fr 12fr 3fr;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.geral-bar .header {
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 2fr;
  font-weight: bold;
}
</style>