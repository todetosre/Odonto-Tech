<template>
    <div v-if="isVisible" class="modal">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Editar Movimentação</h2>
          <button @click="close">Fechar</button>
        </header>
        <form @submit.prevent="submitForm">
          <!-- Tipo de Movimentação -->
          <label for="tipo">Tipo de Movimentação:</label>
          <select id="tipo" v-model="moviment.tipomoviment" required>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
            <option value="Caixa">Caixa</option>
          </select>
  
          <!-- Referência -->
          <label for="referencia">Referência:</label>
          <select id="referencia" v-model="moviment.referencia" @change="handleReferenciaChange" required>
            <option value="Clínica">Clínica</option>
            <option value="Procedimento">Procedimento</option>
          </select>
  
          <!-- Campos específicos para "Procedimento" -->
          <div v-if="moviment.referencia === 'Procedimento'">
            <label for="procedimento">Procedimento Realizado:</label>
            <select id="procedimento" v-model="moviment.procedimento" required>
              <option value="Obturação">Obturação</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Extração">Extração</option>
              <option value="Consulta Preventiva">Consulta Preventiva</option>
            </select>
          </div>
  
          <!-- Campos específicos para "Clínica" -->
          <div v-else-if="moviment.referencia === 'Clínica'">
            <label for="item">Item:</label>
            <input type="text" id="item" v-model="moviment.item" required />
  
            <label for="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" v-model="moviment.qtd" required />
  
            <label for="categoria">Categoria:</label>
            <input type="text" id="categoria" v-model="moviment.categoria" required />
          </div>
  
          <!-- Valor -->
          <label for="valor">Valor:</label>
          <input
            type="text"
            id="valor"
            v-model="formattedValor"
            @input="formatValor"
            required
          />
  
          <!-- Data da Movimentação -->
          <label for="data">Data da Movimentação:</label>
          <input type="date" id="data" v-model="moviment.datamoviment" required />
  
          <!-- Usuário responsável pela movimentação -->
          <label for="usuario">Usuário responsável pela movimentação:</label>
          <input type="text" id="usuario" v-model="moviment.usuario" disabled />
  
          <!-- Botões -->
          <div class="modal-footer">
            <button type="submit">Salvar</button>
            <button type="button" class="cancel-button" @click="close">Cancelar</button>
            <button type="button" class="delete-button" @click="deleteMoviment">Excluir</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditarMoviment',
    props: {
      isVisible: Boolean,
      movimentData: Object,
    },
    data() {
      return {
        moviment: { ...this.movimentData },
        formattedValor: '',
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      async submitForm() {
        const numericValue = parseFloat(
          this.formattedValor.replace('R$', '').replace(/\./g, '').replace(',', '.')
        );
        this.moviment.valor = numericValue;
  
        // Emitindo os dados da movimentação para o pai
        this.$emit('save', this.moviment);
        this.close();
      },
      deleteMoviment() {
        this.$emit('delete', this.moviment);
        this.close();
      },
      formatValor() {
        let input = this.formattedValor.replace(/\D/g, '');
        input = (Number(input) / 100).toFixed(2) + '';
        input = input.replace('.', ',');
        input = input.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.formattedValor = `R$ ${input}`;
      },
      handleReferenciaChange() {
        if (this.moviment.referencia === 'Procedimento') {
          this.moviment.item = '';
          this.moviment.qtd = null;
          this.moviment.categoria = '';
        } else if (this.moviment.referencia === 'Clínica') {
          this.moviment.procedimento = '';
        }
        
        // Garante que a data seja mantida
        this.moviment.datamoviment = this.moviment.datamoviment || ''; 
      },
    },
    watch: {
      movimentData: {
        immediate: true,
        handler(newData) {
          this.moviment = { ...newData };
  
          // Formata o valor para exibição
          this.formattedValor = `R$ ${parseFloat(this.moviment.valor)
            .toFixed(2)
            .replace('.', ',')}`;
  
          // Preenche categoria se for 'Clínica'
          if (this.moviment.referencia === 'Clínica') {
            this.moviment.categoria = this.moviment.categoria || ''; 
          }
  
          // Preenche a data
          this.moviment.datamoviment = this.moviment.datamoviment || ''; 
        },
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
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .modal-header h2 {
    margin: 0;
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
  
  .modal-footer {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .modal-footer button {
    padding: 8px 15px;
    cursor: pointer;
  }
  
  .cancel-button {
    margin-left: auto;
  }
  
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    margin-left: 10px;
    cursor: pointer;
  }
  </style>
  