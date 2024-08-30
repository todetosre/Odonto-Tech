<template>
    <div class="main">
      <!-- Seleção de Pacientes -->
      <div class="select">
        <select v-model="selectedPaciente" @change="onPacienteChange">
          <option value="">Selecione um Paciente</option>
          <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
            {{ paciente.nome }}
          </option>
        </select>
      </div>
  
      <!-- Botões de Ação -->
      <button @click="editarPaciente" v-if="selectedPaciente">{{ isEditable ? 'Salvar' : 'Editar' }}</button>
      <button @click="excluirPaciente" v-if="selectedPaciente">Excluir</button>
      <button @click="voltar">Voltar</button>
  
      <!-- Formulário de Paciente -->
      <div v-if="isFormVisible" class="container-form">
        <div class="info">
          <header><img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon">Informações</header>
          <div class="form-info">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="formData.nome" required :disabled="!isEditable">
            <label for="cpf">CPF:</label>
            <input type="text" id="cpf" v-model="formData.cpf" required placeholder="XXX.XXX.XXX-XX" :disabled="!isEditable">
            <label for="sexo">Sexo:</label>
            <select id="sexo" v-model="formData.sexo" required :disabled="!isEditable">
              <option value="-">-</option>
              <option value="Homem">Homem</option>
              <option value="Mulher">Mulher</option>
            </select>
            <label for="dtnasc">Data Nascimento:</label>
            <input type="date" id="dtnasc" v-model="formData.datNasc" required :disabled="!isEditable">
            <label for="rg">RG:</label>
            <input type="text" id="rg" v-model="formData.rg" required style="width: 130px;" :disabled="!isEditable">
          </div>
        </div><br>
  
        <header><img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon">Endereço</header>
        <div class="form-en">
          <label for="cep">CEP:</label>
          <input type="text" id="cep" v-model="formData.cep" required placeholder="XXXXX-XXX" :disabled="!isEditable">
          <label for="estado">Estado:</label>
          <select id="estado" v-model="formData.estado" required :disabled="!isEditable">
            <option value="-">-</option>
            <!-- Lista de estados -->
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>
          <label for="cidade">Cidade:</label>
          <input type="text" id="cidade" v-model="formData.cidade" required :disabled="!isEditable">
          <div class="new-line">
            <label for="rua">Rua:</label>
            <input type="text" id="rua" v-model="formData.rua" required :disabled="!isEditable">
          </div>
          <label for="num">N.:</label>
          <input type="text" id="num" v-model="formData.num" required style="width: 100px;" :disabled="!isEditable">
          <label for="bairro">Bairro:</label>
          <input type="text" id="bairro" v-model="formData.bairro" required :disabled="!isEditable">
          <div class="new-line">
            <label for="complemento">Complemento:</label>
            <input type="text" id="complemento" v-model="formData.complemento" :disabled="!isEditable">
          </div>
        </div><br>
  
        <header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
        <div class="form-cont">
          <label for="email">E-Mail:</label>
          <input type="text" id="email" v-model="formData.email" required :disabled="!isEditable">
          <label for="tel1">Telefone:</label>
          <input type="text" id="tel1" v-model="formData.tel1" required placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
          <div class="new-line">
            <label for="tel2">Telefone 2:</label>
            <input type="text" id="tel2" v-model="formData.tel2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
          </div>
        </div>
      </div>
  
      <!-- Botões do Formulário -->
      <div class="botao">
        <button id="salvar" @click="editarPaciente">{{ isEditable ? 'Salvar' : 'Editar' }}</button>
        <button id="cancelar" @click="cancelarEdicao">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pacientes: [],
        selectedPaciente: null,
        formData: {
          nome: '',
          cpf: '',
          datNasc: '',
          rg: '',
          sexo: '',
          cep: '',
          estado: '',
          cidade: '',
          rua: '',
          num: '',
          bairro: '',
          complemento: '',
          email: '',
          tel1: '',
          tel2: ''
        },
        isEditable: false,
        isFormVisible: false // Controle de visibilidade do formulário
      };
    },
    mounted() {
      this.fetchPacientes();
    },
    methods: {
      async fetchPacientes() {
        try {
          const response = await fetch('http://localhost:3000/api/pacientes');
          const data = await response.json();
          this.pacientes = data;
        } catch (error) {
          console.error('Erro ao buscar pacientes:', error);
        }
      },
      async onPacienteChange() {
        if (this.selectedPaciente) {
          try {
            const response = await fetch(`http://localhost:3000/api/pacientes/${this.selectedPaciente}`);
            const data = await response.json();
            this.formData = data;
            this.isFormVisible = true; // Exibe o formulário quando um paciente é selecionado
            this.isEditable = false; // Inicialmente, o formulário não é editável
          } catch (error) {
            console.error('Erro ao buscar dados do paciente:', error);
          }
        } else {
          this.isFormVisible = false; // Esconde o formulário se nenhum paciente for selecionado
        }
      },
      async editarPaciente() {
        if (this.isEditable) {
          // Se estiver em modo de edição, salvar os dados
          try {
            await fetch(`http://localhost:3000/api/pacientes/${this.selectedPaciente}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.formData)
            });
            alert('Paciente atualizado com sucesso!');
            this.isEditable = false; // Volta ao modo de visualização
            this.onPacienteChange(); // Atualizar os dados
          } catch (error) {
            console.error('Erro ao salvar paciente:', error);
            alert('Erro ao atualizar o paciente.');
          }
        } else {
          // Se não estiver em modo de edição, habilitar a edição
          this.isEditable = true;
        }
      },
      async excluirPaciente() {
        if (this.selectedPaciente && confirm('Tem certeza que deseja excluir este paciente?')) {
          try {
            await fetch(`http://localhost:3000/api/pacientes/${this.selectedPaciente}`, {
              method: 'DELETE'
            });
            this.pacientes = this.pacientes.filter(p => p.id !== this.selectedPaciente);
            this.selectedPaciente = null;
            this.resetForm(); // Limpa o formulário após a exclusão
            this.isFormVisible = false; // Esconde o formulário após a exclusão
          } catch (error) {
            console.error('Erro ao excluir paciente:', error);
          }
        }
      },
      voltar() {
        this.$router.push('/'); // Redirecionar para a tela inicial ou onde preferir
      },
      cancelarEdicao() {
        this.isEditable = false;
        this.onPacienteChange(); // Recarregar os dados para cancelar as alterações
      },
      resetForm() {
        this.formData = {
          nome: '',
          cpf: '',
          datNasc: '',
          rg: '',
          sexo: '',
          cep: '',
          estado: '',
          cidade: '',
          rua: '',
          num: '',
          bairro: '',
          complemento: '',
          email: '',
          tel1: '',
          tel2: ''
        };
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  
  * {
    font-family: 'Poppins', sans-serif;
  }
  
  .main {
    position: fixed;
    top: 5px;
    left: 255px;
    background-color: rgb(216, 216, 216);
    width: 1105px;
    height: 900px;
  }
  
  .select {
    margin: 20px;
  }
  
  select {
    padding: 5px;
    font-size: 16px;
  }
  
  .container-form {
    position: fixed;
    top: 10px;
    left: 490px;
    color: black;
  }
  
  .form-info, .form-en, .form-cont {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px 9px;
  }
  
  .new-line {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 7px;
  }
  
  .botao {
    margin-top: 20px;
  }
  
  header {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 3px solid black;
    width: 840px;
  }
  
  .form-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  </style>
  