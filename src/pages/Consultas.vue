<template>
  <div class="consultas-container">
    <div class="action">
      <div class="action-bar">
        <button @click="showModal = true">Agendar Consulta</button>
      </div>
    </div>

    <div class="consultas">
      <!-- Cabeçalho do calendário -->
      <div class="calendar-header">
        <button @click="mudarMes(-1)">&#8592;</button>
        <span>{{ nomeMesAtual }} de {{ anoAtual }}</span>
        <button @click="mudarMes(1)">&#8594;</button>
      </div>

      <!-- Barra de dias da semana -->
      <div class="days-bar">
        <span v-for="(dia, index) in diasSemana" :key="index">{{ dia }}</span>
      </div>

      <!-- Dias do mês -->
      <div class="dias-grid">
        <div v-for="dia in diasMes" :key="dia.data" class="dia-box" @click="abrirPopup(dia)">
          <span>{{ dia.diaNumero }}</span>
        </div>
      </div>

      <!-- Popup para detalhes das consultas -->
      <div v-if="diaSelecionado" class="popup-overlay" @click="fecharPopup">
        <div class="popup-content" @click.stop>
          <h3>Consultas do dia {{ diaSelecionado.diaNumero }}/{{ mesAtual + 1 }}/{{ anoAtual }}</h3>
          <ul v-if="diaSelecionado.consultas.length > 0">
            <li v-for="consulta in diaSelecionado.consultas" :key="consulta.id">
              {{ consulta.horario }} - {{ consulta.paciente }} - {{ consulta.procedimento }} - {{ consulta.dentista }}
            </li>
          </ul>
          <p v-else>Não há consultas agendadas para este dia.</p>
          <button @click="fecharPopup">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Modal de agendamento -->
    <AgendarConsultaModal
      :isVisible="showModal"
      :dentistas="dentistas"
      :procedimentos="procedimentos"
      :paciente="paciente"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import AgendarConsultaModal from '@/components/AgendarConsultaModal.vue';

export default {
  name: 'ConsultasView',
  components: {
    NavBar,
    AgendarConsultaModal,
  },
  data() {
    return {
      showModal: false,
      diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      mesAtual: new Date().getMonth(),
      anoAtual: new Date().getFullYear(),
      diasMes: [],
      diaSelecionado: null,
      dentistas: [],   // Lista de dentistas
      procedimentos: [] // Lista de procedimentos
    };
  },
  computed: {
    nomeMesAtual() {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return meses[this.mesAtual];
    }
  },
  mounted() {
    this.gerarDiasDoMes();
    this.fetchDentistas();
    this.fetchProcedimentos();
  },
  methods: {
    async gerarDiasDoMes() {
      const dataInicio = new Date(this.anoAtual, this.mesAtual, 1);
      const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0);
      const dias = [];

      for (let i = 0; i < dataInicio.getDay(); i++) {
        dias.push({ diaNumero: '', consultas: [] });
      }

      for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const data = new Date(this.anoAtual, this.mesAtual, dia);
        const consultas = await this.gerarConsultasDoDia(data);
        dias.push({
          diaNumero: dia,
          data,
          consultas
        });
      }

      this.diasMes = dias;
    },
    mudarMes(direcao) {
      this.mesAtual += direcao;

      if (this.mesAtual < 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      } else if (this.mesAtual > 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      }

      this.gerarDiasDoMes();
    },
    async abrirPopup(dia) {
      if (dia.diaNumero) {
        const data = new Date(this.anoAtual, this.mesAtual, dia.diaNumero).toISOString().split('T')[0];
        try {
          const response = await fetch(`http://localhost:3000/api/consultas/${data}`);
          const consultas = await response.json();
          this.diaSelecionado = { ...dia, consultas };
        } catch (error) {
          console.error('Erro ao buscar consultas:', error);
        }
      }
    },
    fecharPopup() {
      this.diaSelecionado = null;
    },
    async gerarConsultasDoDia(data) {
      try {
        const response = await fetch(`http://localhost:3000/api/consultas?data=${data.toISOString().split('T')[0]}`);
        const consultas = await response.json();
        return consultas.map(consulta => ({
          id: consulta.id,
          horario: consulta.horario,
          paciente: consulta.paciente,
          procedimento: consulta.procedimento,
          dentista: consulta.dentista
        }));
      } catch (err) {
        console.error('Erro ao buscar consultas:', err);
        return [];
      }
    },
    async fetchDentistas() {
      try {
        const response = await fetch('http://localhost:3000/api/dentistas');
        this.dentistas = await response.json();
      } catch (err) {
        console.error('Erro ao buscar dentistas:', err);
      }
    },
    async fetchProcedimentos() {
      try {
        const response = await fetch('http://localhost:3000/api/procedimentos');
        this.procedimentos = await response.json();
      } catch (err) {
        console.error('Erro ao buscar procedimentos:', err);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.consultas-container {
  position: fixed;
  top: 0px;
  left: 250px;
  width: 1100px;
  background-color: rgb(229, 240, 253); /* Altere a cor de fundo para o desejado */
}

.action {
  position: fixed;
  top: 0px;
  left: 250px;
  width: calc(100% - 250px);
  z-index: 2;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border: 1px solid black;
}

.action-bar button {
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

.action-bar button:hover {
  background-color: #08396b;
  color: #fff;
}

.action-bar button.active {
  background-color: #08396b;
  color: #fff;
}

.action-bar button:active {
  background-color: #08396b;
  top: 2px;
}

.consultas {
  position: relative;
  margin: 35px auto 0 auto;
  width: 800px; /* Aumenta a largura do calendário */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 150px;
  color: white;
  background-color: #08396b;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-size: 28px; /* Aumenta o tamanho do texto */
  font-weight: bold;
  width: 100%; /* Preenche a largura do calendário */
}

.days-bar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #08396b;
  text-align: center;
  padding: 15px; /* Aumenta o padding */
  font-size: 18px; /* Aumenta o tamanho do texto */
}

.dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 15px; /* Aumenta o espaço entre os dias */
  margin-top: 30px; /* Aumenta o espaço superior */
}

.dia-box {
  padding: 20px; /* Aumenta o espaço nos dias */
  background-color: #08396b;
  text-align: center;
  border: 1px solid white;
  cursor: pointer;
  font-size: 18px; /* Aumenta o tamanho do número do dia */
  border-radius: 5px; /* Adiciona bordas arredondadas */
}

.dia-box:hover {
  background-color: white;
  color: black;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
}

.popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 400px; /* Tamanho do popup */
}

.popup-content h3 {
  margin-bottom: 20px;
}

.popup-content ul {
  list-style-type: none;
  padding: 0;
}

.popup-content button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.consultas-container {
  background-color: rgb(229, 240, 253); /* Altere a cor de fundo para o desejado */
  min-height: 100vh; /* Garante que a cor de fundo ocupe toda a altura da tela */
  padding: 20px; /* Adiciona algum preenchimento se necessário */
}
</style>
