<template>
  <div>
    <NavBar />
    <div class="container-form">
      <div class="info">
        <header>
          <img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon" />
          Informações
        </header>
        <div class="form-info">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="formData.nome" required />

          <label for="cpf">CPF:</label>
          <input type="text" id="cpf" v-model="formData.cpf" required placeholder="XXX.XXX.XXX-XX"
            :class="{ 'invalid-input': !isCpfValid && formData.cpf !== '' }" />
          <!-- Mensagem de erro -->
          <small v-if="!isCpfValid && formData.cpf !== ''" class="error-message">
            CPF inválido
          </small>

          <label for="sexo">Sexo:</label>
          <select id="sexo" v-model="formData.sexo" required>
            <option value="-">-</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
          </select>

          <label for="dtnasc">Data Nascimento:</label>
          <input type="date" id="dtnasc" v-model="formData.dataNascimento" required />

          <label for="rg">RG:</label>
          <input type="text" id="rg" v-model="formData.rg" required style="width: 130px;" />

          <label for="cro">CRO:</label>
          <input type="text" id="cro" v-model="formData.cro" required placeholder="XXXXX-XX" style="width: 130px;" />

          <label for="funcao">Função:</label>
          <select id="funcao" v-model="formData.funcao" required>
            <option value="-">-</option>
            <option value="Dentista">Dentista</option>
            <option value="Recepcionista">Recepcionista</option>
          </select>
        </div>
      </div>

      <br />
      <header>
        <img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon" />
        Endereço
      </header>
      <div class="form-en">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" v-model="formData.cep" required placeholder="XXXXX-XXX" />

        <label for="estado">Estado:</label>
        <input type="text" id="estado" v-model="formData.estado" required readonly disabled />

        <label for="cidade">Cidade:</label>
        <input type="text" id="cidade" v-model="formData.cidade" required disabled />

        <div class="new-line">
          <label for="rua">Rua:</label>
          <input type="text" id="rua" v-model="formData.rua" required />
        </div>

        <label for="num">N.:</label>
        <input type="text" id="num" v-model="formData.numero" required style="width: 100px;" />

        <label for="bairro">Bairro:</label>
        <input type="text" id="bairro" v-model="formData.bairro" required />

        <div class="new-line">
          <label for="complemento">Complemento:</label>
          <input type="text" id="complemento" v-model="formData.complemento" />
        </div>
      </div>

      <br />
      <header>
        <img src="../components/icons/telefone.png" alt="icon-info" class="form-icon" />
        Contato
      </header>
      <div class="form-cont">
        <label for="email">E-Mail:</label>
        <input type="email" id="email" v-model="formData.email" required
          :class="{ 'invalid-input': !isEmailValid && formData.email !== '' }" @input="validateEmail" />
        <small v-if="!isEmailValid && formData.email !== ''" class="error-message">
          E-mail inválido
        </small>

        <label for="tel1">Telefone:</label>
        <input type="text" id="tel1" v-model="formData.telefone1" required placeholder="(XX) XXXXX-XXXX"
          style="width: 150px;" :class="{ 'invalid-input': !isTelefone1Valid && formData.telefone1 !== '' }"
          @input="formatTelefone('telefone1')" />
        <small v-if="!isTelefone1Valid && formData.telefone1 !== ''" class="error-message">
          Telefone inválido
        </small>

        <div class="new-line">
          <label for="tel2">Telefone 2:</label>
          <input type="text" id="tel2" v-model="formData.telefone2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;"
            :class="{ 'invalid-input': !isTelefone2Valid && formData.telefone2 !== '' }"
            @input="formatTelefone('telefone2')" />
          <small v-if="!isTelefone2Valid && formData.telefone2 !== ''" class="error-message">
            Telefone inválido
          </small>
        </div>
      </div>

      <br />
      <header>
        <img src="../components/icons/emprestimo.png" alt="icon-info" class="form-icon" />
        Dados Bancários
      </header>
      <div class="form-banc">
        <label for="cont-banc">Banco:</label>
        <input type="text" id="cont-banc" v-model="formData.banco" required placeholder="XXX" style="width: 50px;" />

        <label for="agencia">Agência:</label>
        <input type="text" id="agencia" v-model="formData.agencia" required placeholder="XXXX" style="width: 70px;" />

        <label for="cont-corrente">Conta Corrente:</label>
        <input type="text" id="cont-corrente" v-model="formData.contaCorrente" required placeholder="Conta com Dígito"
          style="width: 150px;" />
      </div>
    </div>

    <div class="botao">
      <button id="salvar" @click="submitForm">Salvar</button>
      <button id="cancelar" @click="cancelForm">Cancelar</button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default {
  name: 'CadastroFView',
  components: {
    NavBar
  },
  data() {
    return {
      formData: {
        nome: '',
        cpf: '',
        dataNascimento: '', // Mapeado para "datNasc" no banco de dados
        rg: '',
        funcao: '',
        cep: '',
        estado: '',
        rua: '',
        cidade: '',
        numero: '',
        bairro: '',
        complemento: '',
        email: '',
        telefone1: '', // Mapeado para "tel1" no banco de dados
        telefone2: '', // Mapeado para "tel2" no banco de dados
        banco: '',
        agencia: '',
        cro: '',
        sexo: '',
        contaCorrente: '', // Mapeado para "contCorrente" no banco de dados
      },
      photoUrl: '',
      isCpfValid: true, // Controla a validade do CPF
      isTelefone1Valid: true, // Controla a validade do Telefone 1
      isTelefone2Valid: true, // Controla a validade do Telefone 2
      isEmailValid: true, // Controla a validade do E-mail
    };
  },
  watch: {
    'formData.cpf'(newCpf) {
      // Valida o CPF em tempo real
      this.isCpfValid = this.validateCPF(newCpf);
    },
    'formData.cep'(newCep) {
      // Remove caracteres não numéricos
      const cep = newCep.replace(/\D/g, '');
      if (cep.length === 8) {
        this.fetchAddressData(cep);
      } else {
        // Limpa os campos se o CEP não tiver 8 dígitos
        this.formData.estado = '';
        this.formData.cidade = '';
        this.formData.rua = '';
        this.formData.bairro = '';
        this.formData.complemento = '';
      }
    },
  },
  methods: {
    validateCPF(cpf) {
      // Remove caracteres não numéricos
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf === '') return false;
      // Elimina CPFs inválidos conhecidos
      if (
        cpf.length !== 11 ||
        /^(\d)\1{10}$/.test(cpf)
      ) {
        return false;
      }
      // Valida 1º dígito verificador
      let add = 0;
      for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(9))) return false;
      // Valida 2º dígito verificador
      add = 0;
      for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
      }
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(10))) return false;
      return true;
    },
    validateEmail() {
      const email = this.formData.email;
      // Regex simples para validação de e-mail
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.isEmailValid = re.test(email);
    },
    formatTelefone(field) {
      let telefone = this.formData[field];

      // Remove todos os caracteres não numéricos
      telefone = telefone.replace(/\D/g, '');

      // Limita a 11 dígitos
      telefone = telefone.substring(0, 11);

      // Aplica a formatação
      if (telefone.length > 0) {
        telefone = telefone.replace(
          /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
          function (match, p1, p2, p3) {
            let result = '';
            if (p1) result += '(' + p1 + ') ';
            if (p2) result += p2;
            if (p3) result += '-' + p3;
            return result;
          }
        );
      }

      this.formData[field] = telefone;

      // Valida o telefone
      if (field === 'telefone1') {
        this.isTelefone1Valid = this.validateTelefone(telefone);
      } else if (field === 'telefone2') {
        this.isTelefone2Valid = this.validateTelefone(telefone);
      }
    },
    validateTelefone(telefone) {
      // Remove caracteres não numéricos
      const num = telefone.replace(/\D/g, '');
      // Verifica se tem 10 ou 11 dígitos
      return num.length === 10 || num.length === 11;
    },
    async fetchAddressData(cep) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          const data = response.data;
          // Atualiza os campos do formulário
          this.formData.estado = data.uf;
          this.formData.cidade = data.localidade;
          this.formData.rua = data.logradouro;
          this.formData.bairro = data.bairro;
          this.formData.complemento = data.complemento;
        } else {
          alert('CEP não encontrado.');
          // Limpa os campos caso o CEP não seja encontrado
          this.formData.estado = '';
          this.formData.cidade = '';
          this.formData.rua = '';
          this.formData.bairro = '';
          this.formData.complemento = '';
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert('Ocorreu um erro ao buscar o CEP. Por favor, verifique o CEP e tente novamente.');
      }
    },
    async submitForm() {
      // Verifica se todos os campos estão válidos
      if (!this.isCpfValid || !this.isEmailValid || !this.isTelefone1Valid) {
        alert('Por favor, corrija os campos inválidos antes de enviar o formulário.');
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/api/funcionarios', this.formData);
        if (response.status >= 200 && response.status < 300) {
          alert('Funcionário cadastrado com sucesso!');
          // Opcional: redirecionar ou limpar o formulário
        } else {
          alert('Erro ao cadastrar o funcionário.');
        }
      } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        alert('Ocorreu um erro ao cadastrar o funcionário. Por favor, tente novamente.');
      }
    },
    cancelForm() {
      this.$router.push('/'); // Redireciona para a tela inicial
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

header {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  padding: 10px 0;
  border-bottom: 3px solid black;
  width: 840px;
}

.form-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.container-form {
  position: fixed;
  top: 10px;
  left: 280px;
  color: black;
}

.form-info,
.form-en,
.form-cont,
.form-banc {
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
  position: fixed;
  top: 530px;
  left: 600px;
}

#salvar {
  background: green;
  color: #fff;
  border-color: green;
  cursor: pointer;
  font-size: inherit;
  padding: 15px 40px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

#salvar:hover {
  background-color: #fff;
  color: green;
}

#salvar:active {
  background: green;
  top: 2px;
  color: #fff;
}

#cancelar {
  background-color: red;
  color: #fff;
  border-color: red;
  cursor: pointer;
  font-size: inherit;
  padding: 15px 30px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

#cancelar:hover {
  background-color: #fff;
  color: red;
  border-color: red;
}

#cancelar:active {
  background: red;
  top: 2px;
  color: #fff;
  border-color: red;
}

/* Estilos para o campo inválido e a mensagem de erro */
.invalid-input {
  border: 2px solid red;
}

.error-message {
  color: red;
  font-size: 13px;
  margin-top: -5px;
  margin-bottom: 5px;
  width: 5%;
}
</style>