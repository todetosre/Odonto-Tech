<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <h2>Agendar Consulta</h2>
      <form @submit.prevent="saveAppointment">
        <!-- Campo Paciente -->
        <label for="paciente">Paciente:</label>
        <input type="text" v-model="appointmentData.paciente" required />        

        <!-- Campo Dia -->
        <label for="dia">Dia:</label>
        <input type="date" v-model="appointmentData.dia" required />

        <!-- Campo Horário -->
        <label for="horario">Horário:</label>
        <select v-model="appointmentData.horario" required>
          <option v-for="time in availableTimes" :key="time" :value="time">
            {{ time }}
          </option>
        </select>

        <!-- Campo Procedimento -->
        <label for="procedimento">Procedimento:</label>
        <select v-model="appointmentData.procedimento" required>
          <option v-for="procedimento in procedimentos" :key="procedimento.id" :value="procedimento.nome">
            {{ procedimento.nome }}
          </option>
        </select>

        <!-- Campo Dentista Responsável -->
        <label for="dentista">Dentista Responsável:</label>
        <select v-model="appointmentData.dentista" required>
          <option v-for="dentista in dentistasDisponiveis" :key="dentista.id" :value="dentista.nome">
            {{ dentista.nome }}
          </option>
        </select>

        <!-- Botões de Ação -->
        <div class="modal-footer">
          <button type="submit">Salvar</button>
          <button type="button" @click="closeModal" class="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['isVisible', 'dentistas', 'procedimentos', 'paciente'],
    data() {
      return {
        appointmentData: {
          paciente: '',
          dia: '',
          horario: '',
          procedimento: '',
          dentista: ''
        },
        availableTimes: [
          '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
          '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
          '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
        ],
        procedimentos: [
          { id: 1, nome: 'Limpeza Dental' },
          { id: 2, nome: 'Tratamento de Cárie' },
          { id: 3, nome: 'Canal Radicular' },
          { id: 4, nome: 'Extração de Dente' },
          { id: 5, nome: 'Clareamento Dental' },
          { id: 6, nome: 'Implante Dentário' },
          { id: 7, nome: 'Aparelho Ortodôntico' },
          { id: 8, nome: 'Aplicação de Flúor' },
          { id: 9, nome: 'Prótese Dentária' },
          { id: 10, nome: 'Consulta Preventiva' }
        ],
        dentistasDisponiveis: []
      };
    },
    created() {
      this.fetchDentistas();
    },
    methods: {
      async fetchDentistas() {
        try {
          const response = await axios.get('http://localhost:3000/api/dentistas');
          this.dentistasDisponiveis = response.data;
          console.log('Dentistas carregados:', this.dentistasDisponiveis); // Debugging: Exibir dentistas carregados no console
        } catch (error) {
          console.error('Erro ao buscar dentistas:', error);
        }
      },
      async saveAppointment() {
        const appointmentData = {
          paciente: this.appointmentData.paciente,
          data: this.appointmentData.dia,
          horario: `${this.appointmentData.dia} ${this.appointmentData.horario}:00`,
          procedimento: this.appointmentData.procedimento,
          dentista: this.appointmentData.dentista
        };
  
        console.log('Dados da consulta:', appointmentData);
  
        try {
          const response = await fetch('http://localhost:3000/api/consultas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
          });
  
          if (!response.ok) {
            throw new Error('Erro ao agendar a consulta.');
          }
  
          alert('Consulta agendada com sucesso!');
          this.closeModal();
        } catch (error) {
          console.error('Erro ao salvar a consulta:', error);
          alert('Ocorreu um erro ao agendar a consulta. Tente novamente.');
        }
      },
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 350px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content h2 {
    margin-top: 0; /* Remove margem superior para alinhar com o topo */
    margin-bottom: 20px; /* Espaço inferior para separar do formulário */
  }
  
  .modal-content label {
    display: block;
    margin-bottom: 5px; /* Espaço entre o rótulo e o campo */
  }
  
  .modal-content input,
  .modal-content select {
    display: block;
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  
  .modal-content .modal-footer {
    display: flex;
    justify-content: flex-start; /* Alinha os botões ao início */
    margin-top: 10px;
  }
  
  .modal-content .modal-footer button {
    padding: 8px 15px;
    cursor: pointer;
  }
  
  .modal-content .modal-footer .cancel-button {
    margin-left: auto; /* Alinha o botão de cancelar ao final */
  }
  </style>
  
  