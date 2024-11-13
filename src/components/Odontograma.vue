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
        <option value="canal">Canal</option>
        <option value="obturação">Obturação</option>
      </select>
      <button @click="confirmarProcedimento">Salvar</button>
      <button @click="fecharModal">Cancelar</button>
    </div>

    <!-- Botões de Salvar e Cancelar -->
    <div class="odontograma-buttons">
      <button @click="salvarOdontograma">Salvar</button>
      <button @click="cancelarOdontograma">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Odontograma',
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dentes: [
        // Dentes Superiores (16)
        { id: 1, x: 50, y: 50, width: 50, height: 50, procedimento: null },
        { id: 2, x: 110, y: 50, width: 50, height: 50, procedimento: null },
        { id: 3, x: 170, y: 50, width: 50, height: 50, procedimento: null },
        { id: 4, x: 230, y: 50, width: 50, height: 50, procedimento: null },
        { id: 5, x: 290, y: 50, width: 50, height: 50, procedimento: null },
        { id: 6, x: 350, y: 50, width: 50, height: 50, procedimento: null },
        { id: 7, x: 410, y: 50, width: 50, height: 50, procedimento: null },
        { id: 8, x: 470, y: 50, width: 50, height: 50, procedimento: null },
        { id: 9, x: 530, y: 50, width: 50, height: 50, procedimento: null },
        { id: 10, x: 590, y: 50, width: 50, height: 50, procedimento: null },
        { id: 11, x: 650, y: 50, width: 50, height: 50, procedimento: null },
        { id: 12, x: 710, y: 50, width: 50, height: 50, procedimento: null },
        { id: 13, x: 770, y: 50, width: 50, height: 50, procedimento: null },
        { id: 14, x: 830, y: 50, width: 50, height: 50, procedimento: null },
        { id: 15, x: 890, y: 50, width: 50, height: 50, procedimento: null },
        { id: 16, x: 950, y: 50, width: 50, height: 50, procedimento: null },
        
        // Dentes Inferiores (16)
        { id: 17, x: 50, y: 150, width: 50, height: 50, procedimento: null },
        { id: 18, x: 110, y: 150, width: 50, height: 50, procedimento: null },
        { id: 19, x: 170, y: 150, width: 50, height: 50, procedimento: null },
        { id: 20, x: 230, y: 150, width: 50, height: 50, procedimento: null },
        { id: 21, x: 290, y: 150, width: 50, height: 50, procedimento: null },
        { id: 22, x: 350, y: 150, width: 50, height: 50, procedimento: null },
        { id: 23, x: 410, y: 150, width: 50, height: 50, procedimento: null },
        { id: 24, x: 470, y: 150, width: 50, height: 50, procedimento: null },
        { id: 25, x: 530, y: 150, width: 50, height: 50, procedimento: null },
        { id: 26, x: 590, y: 150, width: 50, height: 50, procedimento: null },
        { id: 27, x: 650, y: 150, width: 50, height: 50, procedimento: null },
        { id: 28, x: 710, y: 150, width: 50, height: 50, procedimento: null },
        { id: 29, x: 770, y: 150, width: 50, height: 50, procedimento: null },
        { id: 30, x: 830, y: 150, width: 50, height: 50, procedimento: null },
        { id: 31, x: 890, y: 150, width: 50, height: 50, procedimento: null },
        { id: 32, x: 950, y: 150, width: 50, height: 50, procedimento: null },
      ],
      denteSelecionado: null,
      procedimentosPendentes: {},
      originalDentes: [],
    };
  },
  watch: {
    paciente: {
      immediate: true,
      handler(newPaciente, oldPaciente) {
        if (newPaciente && newPaciente.id) {
          this.fetchOdontograma();
        }
      },
    },
  },
  mounted() {
    this.fetchOdontograma();
  },
  methods: {
    selecionarDente(dente) {
      this.denteSelecionado = { ...dente };
    },
    fecharModal() {
      this.denteSelecionado = null;
    },
    getClass(dente) {
      const procedimento = this.procedimentosPendentes[dente.id] || dente.procedimento;
      return {
        'dente-limpeza': procedimento === 'limpeza',
        'dente-restauracao': procedimento === 'restauracao',
        'dente-extracao': procedimento === 'extracao',
        'dente-canal': procedimento === 'canal',
        'dente-obturação': procedimento === 'obturação',
      };
    },
    async fetchOdontograma() {
  try {
    if (!this.paciente || !this.paciente.id) {
      console.error('Paciente não definido');
      return;
    }
    const response = await fetch(`http://localhost:3000/api/odontogramas/${this.paciente.id}`);
    if (!response.ok) throw new Error('Erro ao buscar odontograma');
    const data = await response.json();
    // Resetar os procedimentos dos dentes antes de aplicar os novos
    this.dentes.forEach(dente => {
      dente.procedimento = null;
    });
    data.forEach(item => {
      const dente = this.dentes.find(d => d.id === item.dente_id);
      if (dente) {
        dente.procedimento = item.procedimento;
      }
    });
    this.originalDentes = JSON.parse(JSON.stringify(this.dentes));
    this.procedimentosPendentes = {};
  } catch (error) {
    console.error('Erro ao buscar odontograma:', error);
  }
},
    confirmarProcedimento() {
      if (this.denteSelecionado) {
        this.procedimentosPendentes[this.denteSelecionado.id] = this.denteSelecionado.procedimento;

        const dente = this.dentes.find(d => d.id === this.denteSelecionado.id);
        if (dente) {
          dente.procedimento = this.denteSelecionado.procedimento;
        }

        this.fecharModal();
      }
    },
    salvarOdontograma() {
  const updates = Object.keys(this.procedimentosPendentes).map(denteId => {
    return {
      paciente_id: this.paciente.id,
      dente_id: parseInt(denteId),
      procedimento: this.procedimentosPendentes[denteId],
    };
  });

  if (updates.length === 0) {
    // Se não houver alterações, apenas fechar o modal
    this.$emit('close');
    return;
  }

  Promise.all(
    updates.map(update => {
      return fetch(`http://localhost:3000/api/odontogramas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
      });
    })
  ).then(responses => {
    const hasError = responses.some(response => !response.ok);
    if (hasError) {
      alert('Ocorreu um erro ao salvar alguns procedimentos.');
    } else {
      alert('Procedimentos salvos com sucesso!');
    }
    this.procedimentosPendentes = {};
    this.$emit('close');
  }).catch(error => {
    console.error('Erro ao salvar procedimentos:', error);
    alert('Erro ao salvar procedimentos. Tente novamente.');
  });
},
    cancelarOdontograma() {
      this.dentes = JSON.parse(JSON.stringify(this.originalDentes));
      this.procedimentosPendentes = {};
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.odontograma-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  color: black;
}

.odontograma-svg {
  width: 100%;
  height: calc(100% - 60px); /* Ajuste para acomodar os botões */
}

rect {
  fill: #ffffff;
  stroke: #000000;
  cursor: pointer;
}

.dente-limpeza {
  fill: #00ff00;
}

.dente-restauracao {
  fill: #ffff00;
}

.dente-extracao {
  fill: #ff0000;
}

.dente-canal {
  fill: #ff7f50;
}

.dente-obturação {
  fill: #add8e6;
}

/* Estilo para os botões de Salvar e Cancelar */
.odontograma-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.odontograma-buttons button {
  margin-left: 10px;
}
</style>