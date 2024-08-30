<template>
  <div class="main">
    <div class="select">
      <select v-model="selectedFuncionario" @change="onFuncionarioChange">
        <option value="" disabled selected>Selecione um funcionário</option> <!-- Placeholder fixado como primeira opção -->
        <option v-for="funcionario in funcionarios" :key="funcionario.id" :value="funcionario.id">
          {{ funcionario.nome }}
        </option>
      </select>
    </div>

    <!-- Formulário de Funcionário -->
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
          <input type="date" id="dtnasc" v-model="formData.dataNascimento" required :disabled="!isEditable">
          <label for="rg">RG:</label>
          <input type="text" id="rg" v-model="formData.rg" required style="width: 130px;" :disabled="!isEditable">
          <label for="cro">CRO:</label>
          <input type="text" id="cro" v-model="formData.cro" required placeholder="XXXXX-XX" style="width: 130px;" :disabled="!isEditable">
          <label for="funcao">Função:</label>
          <select id="funcao" v-model="formData.funcao" required :disabled="!isEditable">
            <option value="-">-</option>
            <option value="Dentista">Dentista</option>
            <option value="Recepcionista">Recepcionista</option>
          </select>
        </div>
      </div>

      <br>
      <header><img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon">Endereço</header>
      <div class="form-en">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" v-model="formData.cep" required placeholder="XXXXX-XXX" :disabled="!isEditable">
        <label for="estado">Estado:</label>
        <select id="estado" v-model="formData.estado" required :disabled="!isEditable">
          <option value="-">-</option>
          <!-- Lista de estados -->
        </select>
        <label for="cidade">Cidade:</label>
        <input type="text" id="cidade" v-model="formData.cidade" required :disabled="!isEditable">
        <div class="new-line">
          <label for="rua">Rua:</label>
          <input type="text" id="rua" v-model="formData.rua" required :disabled="!isEditable">
        </div>
        <label for="num">N.:</label>
        <input type="text" id="num" v-model="formData.numero" required style="width: 100px;" :disabled="!isEditable">
        <label for="bairro">Bairro:</label>
        <input type="text" id="bairro" v-model="formData.bairro" required :disabled="!isEditable">
        <div class="new-line">
          <label for="complemento">Complemento:</label>
          <input type="text" id="complemento" v-model="formData.complemento" required :disabled="!isEditable">
        </div>
      </div>

      <br>
      <header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
      <div class="form-cont">
        <label for="email">E-Mail:</label>
        <input type="text" id="email" v-model="formData.email" required :disabled="!isEditable">
        <label for="tel1">Telefone:</label>
        <input type="text" id="tel1" v-model="formData.telefone1" required placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
        <div class="new-line">
          <label for="tel2">Telefone 2:</label>
          <input type="text" id="tel2" v-model="formData.telefone2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
        </div>
      </div>

      <br>
      <header><img src="../components/icons/emprestimo.png" alt="icon-info" class="form-icon">Dados Bancários</header>
      <div class="form-banc">
        <label for="cont-banc">Banco:</label>
        <input type="text" id="cont-banc" v-model="formData.banco" required placeholder="XXX" style="width: 50px;" :disabled="!isEditable">
        <label for="agencia">Agência:</label>
        <input type="text" id="agencia" v-model="formData.agencia" required placeholder="XXXX" style="width: 70px;" :disabled="!isEditable">
        <label for="cont-corrente">Conta Corrente:</label>
        <input type="text" id="cont-corrente" v-model="formData.contaCorrente" required placeholder="Conta com Dígito" style="width: 150px;" :disabled="!isEditable">
      </div>

      <div class="botao">
        <button @click="editarFuncionario" v-if="selectedFuncionario">{{ isEditable ? 'Salvar' : 'Editar' }}</button>
        <button @click="excluirFuncionario" v-if="selectedFuncionario">Excluir</button>
        <button @click="voltar">Voltar</button>
        <button id="cancelar" @click="cancelarEdicao" v-if="isEditable">Cancelar</button> <!-- Exibir botão "Cancelar" somente se em modo de edição -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      funcionarios: [],
      selectedFuncionario: null,
      formData: {
        nome: '',
        cpf: '',
        dataNascimento: '',
        rg: '',
        funcao: '',
        cep: '',
        estado: '',
        rua: '',
        numero: '',
        cidade: '',
        bairro: '',
        complemento: '',
        email: '',
        telefone1: '',
        telefone2: '',
        banco: '',
        agencia: '',
        cro: '',
        sexo: '',
        contaCorrente: ''
      },
      isEditable: false,
      isFormVisible: false // Controle de visibilidade do formulário
    };
  },
  mounted() {
    this.fetchFuncionarios();
  },
  methods: {
    async fetchFuncionarios() {
      try {
        const response = await fetch('http://localhost:3000/api/funcionarios');
        const data = await response.json();
        this.funcionarios = data;
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    },
    async onFuncionarioChange() {
      if (this.selectedFuncionario) {
        try {
          const response = await fetch(`http://localhost:3000/api/funcionarios/${this.selectedFuncionario}`);
          const data = await response.json();
          this.formData = data;
          this.isFormVisible = true; // Exibe o formulário quando um funcionário é selecionado
          this.isEditable = false; // Inicialmente, o formulário não é editável
        } catch (error) {
          console.error('Erro ao buscar dados do funcionário:', error);
        }
      } else {
        this.isFormVisible = false; // Esconde o formulário se nenhum funcionário for selecionado
      }
    },
    async editarFuncionario() {
      if (this.isEditable) {
        // Se estiver em modo de edição, salvar os dados
        try {
          await fetch(`http://localhost:3000/api/funcionarios/${this.selectedFuncionario}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formData)
          });
          alert('Funcionário atualizado com sucesso!');
          this.isEditable = false; // Volta ao modo de visualização
          this.onFuncionarioChange(); // Atualizar os dados
        } catch (error) {
          console.error('Erro ao salvar funcionário:', error);
          alert('Erro ao atualizar o funcionário.');
        }
      } else {
        // Se não estiver em modo de edição, habilitar a edição
        this.isEditable = true;
      }
    },
    async excluirFuncionario() {
      if (this.selectedFuncionario && confirm('Tem certeza que deseja excluir este funcionário e todas as suas informações?')) {
        try {
          await fetch(`http://localhost:3000/api/funcionarios/${this.selectedFuncionario}`, {
            method: 'DELETE'
          });
          alert('Funcionário excluído com sucesso!');
          this.funcionarios = this.funcionarios.filter(f => f.id !== this.selectedFuncionario);
          this.selectedFuncionario = null;
          this.formData = {
            nome: '',
            cpf: '',
            dataNascimento: '',
            rg: '',
            funcao: '',
            cep: '',
            estado: '',
            rua: '',
            numero: '',
            cidade: '',
            bairro: '',
            complemento: '',
            email: '',
            telefone1: '',
            telefone2: '',
            banco: '',
            agencia: '',
            cro: '',
            sexo: '',
            contaCorrente: ''
          };
          this.isFormVisible = false; // Esconde o formulário após a exclusão
        } catch (error) {
          console.error('Erro ao excluir funcionário:', error);
          alert('Erro ao excluir o funcionário.');
        }
      }
    },
    voltar() {
      this.$router.push('/'); // Redirecionar para a tela inicial ou onde preferir
    },
    cancelarEdicao() {
      this.isEditable = false;
      this.onFuncionarioChange(); // Recarregar os dados para cancelar as alterações
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

.form-info, .form-en, .form-cont, .form-banc {
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
