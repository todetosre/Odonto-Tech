<template>
  <div class="odontograma-container">
    <svg class="odontograma-svg">
      <rect
        v-for="dente in dentes"
        :key="dente.id"
        :x="dente.x"
        :y="dente.y"
        :width="dente.width"
        :height="dente.height"
        :class="getClass(dente)"
        @click="selecionarDente(dente)"
      />
    </svg>
    <div v-if="denteSelecionado" class="modal">
      <h3>Procedimento para o Dente {{ denteSelecionado.id }}</h3>
      <select v-model="denteSelecionado.procedimento">
        <option value="limpeza">Limpeza</option>
        <option value="restauracao">Restauração</option>
        <option value="extracao">Extração</option>
      </select>
      <button @click="confirmarProcedimento">Confirmar</button>
      <button @click="fecharModal">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Odontograma',
  data() {
    return {
      dentes: [
        { id: 1, x: 50, y: 50, width: 50, height: 50, procedimento: null },
        { id: 2, x: 110, y: 50, width: 50, height: 50, procedimento: null },
        // Adicione mais dentes conforme necessário
      ],
      denteSelecionado: null,
    };
  },
  methods: {
    selecionarDente(dente) {
      this.denteSelecionado = dente;
    },
    confirmarProcedimento() {
      this.denteSelecionado = null;
    },
    fecharModal() {
      this.denteSelecionado = null;
    },
    getClass(dente) {
      return {
        'dente-limpeza': dente.procedimento === 'limpeza',
        'dente-restauracao': dente.procedimento === 'restauracao',
        'dente-extracao': dente.procedimento === 'extracao',
      };
    }
  }
};
</script>

<style scoped>
h3 {
  color: black;
}

.odontograma-container {
  position: fixed;
  margin-top: -50px;
  margin-left: -330px;
  width: 1090px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  background-color: #fff;
}

.odontograma-svg {
  width: 80%;
  height: 80%;
}

rect {
  fill: #ffffff;
  stroke: #000000;
  cursor: pointer;
}

.dente-limpeza {
  fill: #00ff00; /* Verde para limpeza */
}

.dente-restauracao {
  fill: #ffff00; /* Amarelo para restauração */
}

.dente-extracao {
  fill: #ff0000; /* Vermelho para extração */
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>
