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
    };
  },
  mounted() {
    this.fetchOdontograma();
},
  methods: {
    selecionarDente(dente) {
      this.denteSelecionado = dente;
    },
    confirmarProcedimento() {
      this.denteSelecionado = null;
      // Aqui você pode adicionar a lógica de salvar o procedimento no banco
    },
    fecharModal() {
      this.denteSelecionado = null;
    },
    getClass(dente) {
      return {
        'dente-limpeza': dente.procedimento === 'limpeza',
        'dente-restauracao': dente.procedimento === 'restauracao',
        'dente-extracao': dente.procedimento === 'extracao',
        'dente-canal': dente.procedimento === 'canal',
        'dente-obturação': dente.procedimento === 'obturação',
      };
    }
  },
  async fetchOdontograma() {
        try {
            const response = await fetch(`http://localhost:3000/api/odontogramas/${this.paciente.id}`);
            const data = await response.json();
            data.forEach(item => {
                const dente = this.dentes.find(d => d.id === item.dente_id);
                if (dente) {
                    dente.procedimento = item.procedimento;
                }
            });
        } catch (error) {
            console.error('Erro ao buscar odontograma:', error);
        }
    },

    async confirmarProcedimento() {
        if (this.denteSelecionado) {
            try {
                await fetch(`http://localhost:3000/api/odontogramas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paciente_id: this.paciente.id,
                        dente_id: this.denteSelecionado.id,
                        procedimento: this.denteSelecionado.procedimento
                    })
                });
                this.fecharModal(); // Fecha o modal após salvar
                await this.fetchOdontograma(); // Atualiza o odontograma
            } catch (error) {
                console.error('Erro ao salvar procedimento:', error);
            }
        }
    }
};
</script>

<style scoped>
.odontograma-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
}

.odontograma-svg {
  width: 90%;
  height: 400px;
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

.dente-canal {
  fill: #ff7f50; /* Coral para canal */
}

.dente-obturação {
  fill: #add8e6; /* Azul claro para obturação */
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
