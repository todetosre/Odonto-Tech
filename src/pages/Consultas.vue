<template>
  <div class="consultas">
    <div class="calendar">
      <div class="days-bar">
        <span>Seg</span> | 
        <span>Ter</span> | 
        <span>Qua</span> | 
        <span>Qui</span> | 
        <span>Sex</span> | 
        <span>Sab</span> 
      </div>
      <div class="horarios-grid">
        <div v-for="hora in horarios" :key="hora" class="horario-row">
          <div v-for="dia in diasSemana" :key="dia" class="horario-box">
            {{ hora }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'ConsultasView',
  components: {
    NavBar
  },
  data() {
    return {
      diasSemana: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      horarios: this.gerarHorarios()
    };
  },
  methods: {
    gerarHorarios() {
      const horarios = [];
      let horaAtual = 7 * 60; // 07:00 em minutos
      const fim = 20 * 60; // 20:00 em minutos

      while (horaAtual <= fim) {
        const horas = String(Math.floor(horaAtual / 60)).padStart(2, '0');
        const minutos = String(horaAtual % 60).padStart(2, '0');
        horarios.push(`${horas}:${minutos}`);
        horaAtual += 30; // incrementa 30 minutos
      }

      return horarios;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.calendar {
  margin-left: 158px; /* Mantém a mesma margem da days-bar */
}

.days-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgb(197, 197, 197); /* Cor de fundo da barra */
  font-size: 20px;
  font-weight: bold;
  cursor: default;
  position: sticky; /* Garante que a barra fique sempre visível no topo */
  top: 0;
  z-index: 1000; /* Mantém a barra acima dos demais elementos */
}

.days-bar span {
  padding: 0 68px;
  color: black;
  cursor: default;
}

.days-bar span:not(:last-child)::after {
  margin-left: 10px;
  color: black;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 colunas para os dias da semana */
  grid-gap: 10px;
  margin-top: 20px;
  width: 100%; /* Garante que a largura da grid seja a mesma da days-bar */
  box-sizing: border-box; /* Inclui padding e border na largura total */
}

.horario-row {
  display: contents; /* mantém o alinhamento correto */
}

.horario-box {
  padding: 10px;
  background-color: rgb(197, 197, 197);
  text-align: center;
  border: 1px solid #ccc;
  font-size: 14px;
  font-weight: bold;
  color: black;
  cursor: default;
}

</style>