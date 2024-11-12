<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <h2>Movimentação Financeira</h2>
      <form @submit.prevent="saveTransaction">
        <!-- Tipo de Movimentação -->
        <label for="tipo">Tipo de Movimentação:</label>
        <select v-model="transactionData.tipo" required>
          <option value="Entrada">Entrada</option>
          <option value="Saída">Saída</option>
          <option value="Caixa">Caixa</option>
        </select>

        <!-- Referência -->
        <label for="referencia">Referência:</label>
        <select v-model="transactionData.referencia" @change="handleReferenciaChange" required>
          <option value="" disabled selected>Selecione uma opção</option>
          <option value="Procedimento">Procedimento</option>
          <option value="Clínica">Clínica</option>
        </select>

        <div v-if="transactionData.referencia === 'Procedimento'">
          <!-- Seleção de Paciente -->
          <label for="paciente">Paciente:</label>
          <select v-model="transactionData.paciente" :disabled="loadingPacientes || !pacientes.length" required>
            <option v-for="paciente in pacientes" :key="paciente.paciente" :value="paciente.paciente">
              {{ paciente.paciente }}
            </option>
            <option value="" disabled>Selecione um paciente</option>
          </select>

          <!-- Campo Procedimento -->
          <label for="procedimento">Procedimento Realizado:</label>
          <select v-model="transactionData.procedimento" required>
            <option value="" disabled selected>Selecione um procedimento</option>
            <option value="Obturação">Obturação</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Extração">Extração</option>
            <option value="Consulta Preventiva">Consulta Preventiva</option>
          </select>
        </div>

        <div v-else-if="transactionData.referencia === 'Clínica'">
          <label for="item">Item:</label>
          <input type="text" v-model="transactionData.item" placeholder="Descreva o item" required />
          <label for="quantidade">Quantidade movimentada:</label>
          <input type="number" v-model="transactionData.quantidade" placeholder="Quantidade" required />
        </div>

        <!-- Valor -->
        <label for="valor">Valor:</label>
        <input
          type="text"
          v-model="formattedValor"
          placeholder="R$0,00"
          @input="formatValor"
          required
        />

        <!-- Data da Movimentação (abaixo do valor, somente se não for "Procedimento") -->
        <div v-if="transactionData.referencia !== 'Procedimento'">
          <label for="data">Data da Movimentação:</label>
          <input type="date" v-model="transactionData.data" required />
        </div>

        <!-- Botões de Ação -->
        <div class="modal-footer">
          <button type="submit">Salvar</button>
          <button type="button" @click="cancel" class="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      transactionData: {
        tipo: '',
        referencia: '',
        procedimento: '',
        item: '',
        quantidade: null,
        valor: 0,
        data: '',
        paciente: '',
      },
      pacientes: [],
      formattedValor: '',
      loadingPacientes: false,
    };
  },
  methods: {
    getCurrentUser() {
      return localStorage.getItem('nomeUsuario');
    },
    
    handleReferenciaChange() {
      if (this.transactionData.referencia === 'Procedimento') {
        // Define a data atual
        const today = new Date().toISOString().substr(0, 10); // Formato 'YYYY-MM-DD'
        this.transactionData.data = today;

        // Busca os pacientes agendados a partir da data atual
        this.fetchPacientes();
      } else {
        // Limpa os campos se não for "Procedimento"
        this.transactionData.data = '';
        this.pacientes = [];
      }
    },

    async fetchPacientes() {
      if (this.transactionData.data) {
        this.loadingPacientes = true; // Ativa o indicador de carregamento
        try {
          // Certifique-se de incluir a hora na data, caso o backend precise disso
          const dataFormatada = this.transactionData.data;

          const response = await axios.get('http://localhost:3000/api/pacientes/agendados', {
            params: { data: dataFormatada },
          });

          // Preenche a lista de pacientes com os dados da resposta
          this.pacientes = response.data;

          // Se não houver pacientes, exibe uma mensagem
          if (this.pacientes.length === 0) {
            alert("Nenhum paciente agendado para essa data.");
          }
        } catch (error) {
          console.error('Erro ao buscar pacientes:', error);
          alert("Erro ao buscar pacientes. Verifique a API.");
        } finally {
          this.loadingPacientes = false; // Desativa o indicador de carregamento
        }
      }
    },  

    async saveTransaction() {
      try {
        const numericValue = parseFloat(this.formattedValor.replace('R$', '').replace(/\./g, '').replace(',', '.'));

        // Determina os valores de entrada, saída e caixa com base no tipo de movimentação
        let entrada = null;
        let saida = null;
        let caixa = null;

        if (this.transactionData.tipo === 'Entrada') {
          entrada = numericValue;
        } else if (this.transactionData.tipo === 'Saída') {
          saida = numericValue;
        } else if (this.transactionData.tipo === 'Caixa') {
          caixa = numericValue;
        }

        const payload = {
          tipomoviment: this.transactionData.tipo,
          referencia: this.transactionData.referencia,
          valor: numericValue,
          datamoviment: this.transactionData.data,
          procedimento: this.transactionData.referencia === 'Procedimento' ? this.transactionData.procedimento : null,
          item: this.transactionData.referencia === 'Clínica' ? this.transactionData.item : null,
          qtd: this.transactionData.referencia === 'Clínica' ? this.transactionData.quantidade : null,
          usuario: this.getCurrentUser(),
          entrada: entrada,
          saida: saida,
          caixa: caixa
        };

        // Log do payload
        console.log('Payload enviado para /api/financeiro:', payload);

        // Salva a movimentação financeira
        const response = await axios.post('http://localhost:3000/api/financeiro', payload);
        console.log('Movimentação adicionada:', response.data);

        // Se a referência for 'Procedimento', atualiza a presença na tabela 'consultas'
        if (this.transactionData.referencia === 'Procedimento') {
          const updatePayload = {
            paciente: this.transactionData.paciente
          };

          console.log('Payload enviado para atualizar-presenca:', updatePayload);

          await axios.put('http://localhost:3000/api/consultas/atualizar-presenca', updatePayload);
          console.log('Presença atualizada para Atendido.');
        }

        this.cancel();
      } catch (error) {
        console.error('Erro ao adicionar a movimentação:', error);
        if (error.response) {
          console.error('Resposta de erro do servidor:', error.response.data);
        }
        alert("Erro ao salvar movimentação. Verifique a API.");
      }
    },
      
    cancel() {
      // Limpa todos os campos
      this.transactionData = {
        tipo: '',
        referencia: '',
        procedimento: '',
        item: '',
        quantidade: '',
        valor: 0,
        data: '',
        paciente: '',
      };
      this.formattedValor = '';
      this.closeModal(); // Fecha o modal
    },

    closeModal() {
      this.$emit('close'); // Emite um evento para o componente pai
    },

    formatValor() {
      let input = this.formattedValor.replace(/\D/g, ''); // Remove caracteres não numéricos
      input = (Number(input) / 100).toFixed(2) + ''; // Converte para formato decimal
      input = input.replace('.', ','); // Troca ponto por vírgula
      input = input.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formata como moeda
      this.formattedValor = `R$ ${input}`; // Adiciona o símbolo R$
    },
  },
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
  margin-top: 0;
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
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
  justify-content: flex-start;
  margin-top: 10px;
}

.modal-content .modal-footer button {
  padding: 8px 15px;
  cursor: pointer;
}

.modal-content .modal-footer .cancel-button {
  margin-left: auto;
}
</style>
