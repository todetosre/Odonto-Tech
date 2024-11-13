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
        <div 
          v-for="dia in diasMes" 
          :key="dia.data" 
          :class="['dia-box', dia.classeBorda, { 'hoje': dia.isHoje }]" 
          @click="abrirPopup(dia)"
        >
          <span>{{ dia.diaNumero }}</span>
        </div>
      </div>

      <!-- Indicadores de cores -->
      <div class="color-indicators">  
  <div class="color-indicators-Vermelha">
    <div class="color-box borda-vermelha"></div>
    <span style="font-size: 2.5mm;">Horários preenchidos.</span>
  </div>
  <div class="color-indicators-Amarela">
    <div class="color-box borda-amarela"></div>
    <span style="font-size: 2.5mm;">Restam alguns horários.</span>
  </div>
  <div class="color-indicators-Branca">
    <div class="color-box borda-branca"></div>
    <span style="font-size: 2.5mm;">Dias livres.</span>
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
      dentistas: [],
      procedimentos: []
    };
  },
  computed: {
    nomeMesAtual() {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return meses[this.mesAtual];
    },
    diaAtual() {
      const hoje = new Date();
      return {
        dia: hoje.getDate(),
        mes: hoje.getMonth(),
        ano: hoje.getFullYear()
      };
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

      // Adicionar dias vazios no início para alinhar com o dia da semana
      for (let i = 0; i < dataInicio.getDay(); i++) {
          dias.push({ diaNumero: '', consultas: [], classeBorda: '' });
      }

      // Gerar dias do mês com as consultas e classes de borda
      for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
          const data = new Date(this.anoAtual, this.mesAtual, dia);

          // Obter consultas específicas para o dia atual
          const consultas = await this.gerarConsultasDoDia(data);

          // Aplicar a classe de borda com base no número de consultas
          let classeBorda = '';
          if (consultas.length < 9) {
            classeBorda = 'borda-branca';
          } else if (consultas.length >= 9 && consultas.length <= 18) {
            classeBorda = 'borda-amarela';
          } else if (consultas.length >= 19) {
            classeBorda = 'borda-vermelha';
          }

          // Criar um identificador único para o dia
          const idDia = `${this.anoAtual}-${this.mesAtual}-${dia}`;

          // Adicionar o dia com os dados únicos para cada dia
          dias.push({
              id: idDia, // ID único para o dia
              diaNumero: dia,
              data,
              consultas: [...consultas], // Clonando o array de consultas para garantir que seja único
              classeBorda, // Classe específica para o dia
              isHoje: this.diaAtual.dia === dia && this.diaAtual.mes === this.mesAtual && this.diaAtual.ano === this.anoAtual
          });
      }

      // Atualizar a lista de dias no estado
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

            // Adiciona as consultas ao dia selecionado
            this.diaSelecionado = {
                ...dia,
                consultas: consultas.length > 0 ? consultas : [],
            };
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
        }
      }
    },
    fecharPopup() {
      this.diaSelecionado = null;
    },
    async gerarConsultasDoDia(data) {
      const formattedData = data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      try {
          const response = await fetch(`http://localhost:3000/api/consultas/${formattedData}`);
          const consultas = await response.json();
          return consultas; // Retorna as consultas para esse dia específico
      } catch (error) {
          console.error('Erro ao buscar consultas do dia:', error);
          return []; // Retorna um array vazio em caso de erro
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
  width: 1290px;
  background-color: rgb(229, 240, 253);
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
  justify-content: flex-end;
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

.consultas {
  cursor: default;
  position: relative;
  margin: 35px auto 0 auto;
  width: 700px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 250px;
  color: white;
  background-color: #08396b;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-size: 28px;
  font-weight: bold;
  width: 100%;
}

.days-bar {
  cursor: default;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #08396b;
  text-align: center;
  padding: 15px;
  font-size: 18px;
}

.dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 15px;
  margin-top: 30px;
}

.dia-box {
  padding: 20px;
  background-color: #08396b;
  text-align: center;
  font-size: 18px;
  border-radius: 5px;
  color: white;
  transition: border-color 0.3s ease;
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
  width: 550px;
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

.color-indicators {
  display: flex;
  align-items: center;
  margin-top: 20px; /* Espaço acima dos indicadores */
}

.color-indicators-Branca,
.color-indicators-Vermelha,
.color-indicators-Amarela {
  display: flex;
  align-items: center; /* Garante que os textos fiquem alinhados verticalmente */
}

.color-indicators-Vermelha {
  margin-right: 20px; /* Espaço à direita da Vermelha */
}

.color-indicators-Amarela {
  margin-left: 20px; /* Espaço à esquerda da Amarela, se necessário */
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px; /* Espaço entre a caixa e o texto */
}

.color-indicators-Branca .color-box {
  margin-left: 15px; /* Aumenta a distância entre o quadrado branco e o texto */
}

.borda-branca {
  border: 3px solid white;
}

.borda-amarela {
  border: 3px solid yellow;
}

.borda-vermelha {
  border: 3px solid red;
}

/* Classe para o dia de hoje */
.hoje {
  background-color: white;
  color: black;
}
</style>
