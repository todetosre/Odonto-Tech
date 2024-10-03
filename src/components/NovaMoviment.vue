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

                <!-- Data da Movimentação -->
                <label for="data">Data da Movimentação:</label>
                <input type="date" v-model="transactionData.data" required />

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
                tipomoviment: '',
                referencia: '',
                procedimento: '',
                item: '',
                qtd: null,
                valor: 0,
                datamoviment: '',
            },
            formattedValor: '',
        };
    },
    methods: {
        getCurrentUser() {
        return localStorage.getItem('nomeUsuario');
    },
        async saveTransaction() {
    try {
        const numericValue = parseFloat(this.formattedValor.replace('R$', '').replace(/\./g, '').replace(',', '.'));

        console.log("Dados da Transação:", this.transactionData);
        console.log("Valor Numérico:", numericValue);

        const payload = {
            tipomoviment: this.transactionData.tipo,
            referencia: this.transactionData.referencia,
            valor: numericValue,
            datamoviment: this.transactionData.data,
            entrada: this.transactionData.tipo === 'Entrada' ? numericValue : null,
            saida: this.transactionData.tipo === 'Saída' ? numericValue : null,
            caixa: this.transactionData.tipo === 'Caixa' ? numericValue : null,
            procedimento: this.transactionData.referencia === 'Procedimento' ? this.transactionData.procedimento : null,
            item: this.transactionData.referencia === 'Clínica' ? this.transactionData.item : null,
            qtd: this.transactionData.referencia === 'Clínica' ? this.transactionData.quantidade : null,
            usuario: this.getCurrentUser()
        };

        console.log("Payload enviado:", payload);

        const response = await axios.post('http://localhost:3000/api/financeiro', payload);
        console.log('Movimentação adicionada:', response.data);

        this.cancel();
    } catch (error) {
        console.error('Erro ao adicionar a movimentação:', error);
    }
},
        cancel() {
            // Limpa todos os campos
            this.transactionData = {
                tipomoviment: '',
                referencia: '',
                procedimento: '',
                item: '',
                qtd: '',
                valor: 0,
                datamoviment: '',
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
