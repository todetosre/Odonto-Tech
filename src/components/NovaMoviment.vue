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
                <input type="text" v-model="transactionData.referencia" placeholder="Descreva a ação" required />

                <!-- Valor -->
                <label for="valor">Valor:</label>
                <input
                    type="text"
                    v-model="formattedValor"
                    placeholder="R$0,00"
                    @input="formatValor"
                    required
                />

                <!-- Data da Movimentação -->
                <label for="data">Data da Movimentação:</label>
                <input type="date" v-model="transactionData.data" required />

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
                valor: 0,
                data: '',
            },
            formattedValor: '',
        };
    },
    methods: {
        saveTransaction() {
            // Lógica para salvar a movimentação financeira
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