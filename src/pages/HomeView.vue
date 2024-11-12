<template>
  <div class="back">
    <div class="proc-dia">
      
      <div class="agendados">
        <h1 style="font-size: 10ch; position: fixed; margin-left: 110px; margin-top: 10px">{{ totalAgendados }}</h1>
        <p style="position: absolute; top: 130px; left: 60px">Pacientes Agendados</p>
        <img src="../components/icons/agenda.png" alt="Agenda-Icon" style="top: 160px; left: 125px;">
      </div>

      <div class="confirmados">
        <h1 style="font-size: 10ch; position: fixed; margin-left: 410px; margin-top: 10px; color: blue;">{{ totalConfirmados }}</h1>
        <p style="position: absolute; top: 130px; left: 350px; color: blue;">Pacientes Confirmados</p>
        <img src="../components/icons/verificado.png" alt="Confirmados-Icon" style="top: 160px; left: 425px; color: blue;">
      </div>

      <div class="atendidos">
        <h1 style="font-size: 10ch; position: fixed; margin-left: 710px; margin-top: 10px; color: green;">0</h1>
        <p style="position: absolute; top: 130px; left: 665px; color: green;">Pacientes Atendidos</p>
        <img src="../components/icons/verificado.png" alt="Atendidos-Icon" style="top: 160px; left: 725px; color: green">
      </div>

      <div class="faltaram">
        <h1 style="font-size: 10ch; position: fixed; margin-left: 1020px; margin-top: 10px; color: red;">{{ totalFaltaram }}</h1>
        <p style="position: absolute; top: 130px; left: 960px; color: red;">Pacientes que Faltaram</p>
        <img src="../components/icons/bloqueado.png" alt="Faltaram-Icon" style="top: 160px; left: 1035px; color: red;">
      </div>

    </div>

    <div class="pac-dia">
      <div class="list-header">
        <span class="header-item">Nome</span>
        <span class="header-item">Procedimento</span>
        <span class="header-item">Horário</span>
        <span class="header-item">Presença?</span>
      </div>

      <ul class="appointment-list">
        <li
          v-for="(appointment, index) in todaysAppointments"
          :key="index"
          class="appointment-item"
        >
          <span class="item-name">{{ appointment.paciente }}</span>
          <span class="item-procedure">{{ appointment.procedimento }}</span>
          <span class="item-time">{{ appointment.horario }}</span>
          <span class="item-presence">
            <select>
              <option disabled value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </span>
        </li>
      </ul>

      <!-- Mensagem quando não há agendamentos -->
      <div v-if="todaysAppointments.length === 0" class="no-appointments">
        Não há agendamentos para hoje!
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default {
  name: 'HomeView',
  components: {
    NavBar,
  },
  data() {
    return {
      appointments: [],
    };
  },
  computed: {
    todaysAppointments() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split('T')[0];
      return this.appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.data).toISOString().split('T')[0];
        return appointmentDate === todayString;
      });
    },
    totalAgendados() {
      return this.todaysAppointments.length;
    },
    totalConfirmados() {
      return this.todaysAppointments.filter(a => a.presenca === 'Sim').length;
    },
    totalFaltaram() {
      return this.todaysAppointments.filter(a => a.presenca === 'Não').length;
    },
  },
  created() {
    this.fetchAppointments();
  },
  methods: {
    fetchAppointments() {
      axios
        .get('http://localhost:3000/api/appointments')
        .then((response) => {
          this.appointments = response.data;
          console.log('Dados recebidos:', this.appointments);
        })
        .catch((error) => {
          console.error('Erro ao buscar os agendamentos:', error);
        });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.back {
  position: fixed;
  left: 250px;
  top: 0;
  width: calc(100% - 250px);
  height: 100%;
  background-color: #f4f4f4;
  overflow-y: auto;
}

.proc-dia {
  position: fixed;
  left: 290px;
  top: 10px;
  width: 1200px;
  height: 220px;
  background-color: white;
  border: 1px solid black;
  color: black;
}

.pac-dia {
  position: fixed;
  left: 263px;
  top: 240px;
  width: 1260px;
  height: calc(100% - 240px);
  background-color: white;
  border: 2px solid black;
  overflow-y: auto;
  padding: 20px;
  color: black;
}

img{
  position: absolute;
  width: 30px;
  height: 30px;
}

.list-header {
  display: flex;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.header-item {
  flex: 1;
  text-align: center;
}

.appointment-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.appointment-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-name,
.item-procedure,
.item-time,
.item-presence {
  flex: 1;
  text-align: center;
}

.no-appointments {
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 20px;
}

select {
  padding: 5px;
}

@media screen and (max-width: 768px) {
  .appointment-item {
    flex-direction: column;
  }

  .item-name,
  .item-procedure,
  .item-time,
  .item-presence {
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>
