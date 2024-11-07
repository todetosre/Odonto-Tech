<template>
  <div class="back">
    <div class="proc-dia">

      <div class="agendados">
        <h1 style="font-size: 10ch; position: fixed; margin-left: 110px; margin-top: 10px">0</h1>
        <p style="position: absolute; top: 130px; left: 60px">Pacientes Agendados</p>
        <img src="../components/icons/agenda.png" alt="Agenda-Icon" style="top: 160px; left: 125px;">

        <h1 style="font-size: 10ch; position: fixed; margin-left: 410px; margin-top: 10px; color: blue;">0</h1>
        <p style="position: absolute; top: 130px; left: 350px; color: blue;">Pacientes Confirmados</p>
        <img src="../components/icons/verificado.png" alt="Confirmados-Icon" style="top: 160px; left: 425px; color: blue;">

        <h1 style="font-size: 10ch; position: fixed; margin-left: 710px; margin-top: 10px; color: green;">0</h1>
        <p style="position: absolute; top: 130px; left: 665px; color: green;">Pacientes Atendidos</p>
        <img src="../components/icons/verificado.png" alt="Confirmados-Icon" style="top: 160px; left: 725px; color: green">

        <h1 style="font-size: 10ch; position: fixed; margin-left: 1020px; margin-top: 10px; color: red;">0</h1>
        <p style="position: absolute; top: 130px; left: 960px; color: red;">Pacientes que Faltaram</p>
        <img src="../components/icons/bloqueado.png" alt="Confirmados-Icon" style="top: 160px; left: 1035px; color: red;">
      </div>

    </div>

    <div class="pac-dia"></div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'HomeView',
  components: {
    NavBar
  },
  data() {
    
   }

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.back{
  position: fixed;
  left: 250px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
}
.proc-dia{
  position: fixed;
  left: 290px;
  top: 10px;
  width: 1200px;
  height: 220px;
  background-color: white;
  border: 1px solid black;
}
.pac-dia{
  position: fixed;
  left: 263px;
  top: 240px;
  width: 1260px;
  height: 100%;
  background-color: white;
  border: 2px solid black;
}

img{
  position: absolute;
  width: 30px;
  height: 30px;
}
</style>
