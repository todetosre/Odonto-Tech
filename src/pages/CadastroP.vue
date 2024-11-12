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
          <input type="text" v-model="paciente.nome" id="nome" required />

          <label for="cpf">CPF:</label>
          <input
            type="text"
            v-model="paciente.cpf"
            id="cpf"
            required
            placeholder="XXX.XXX.XXX-XX"
            :class="{ 'invalid-input': !isCpfValid && paciente.cpf !== '' }"
          />
          <!-- Mensagem de erro -->
          <small v-if="!isCpfValid && paciente.cpf !== ''" class="error-message">
            CPF inválido
          </small>

          <label for="sexo">Sexo:</label>
          <select v-model="paciente.sexo" id="sexo" required>
            <option value="-">-</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
          </select>

          <label for="dtnasc">Data Nascimento:</label>
          <input type="date" v-model="paciente.datNasc" id="dtnasc" required />

          <label for="rg">RG:</label>
          <input type="text" v-model="paciente.rg" id="rg" required style="width: 130px;" />
        </div>
      </div>
      <br />

      <header>
        <img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon" />
        Endereço
      </header>
      <div class="form-en">
        <label for="cep">CEP:</label>
        <input type="text" v-model="paciente.cep" id="cep" required placeholder="XXXXX-XXX" />

        <!-- Campo de Estado preenchido automaticamente -->
        <label for="estado">Estado:</label>
        <input type="text" v-model="paciente.estado" id="estado" required readonly />

        <label for="cidade">Cidade:</label>
        <input type="text" v-model="paciente.cidade" id="cidade" required />

        <div class="new-line">
          <label for="rua">Rua:</label>
          <input type="text" v-model="paciente.rua" id="rua" required />
        </div>

        <label for="num">N.:</label>
        <input type="text" v-model="paciente.num" id="num" required style="width: 100px;" />

        <label for="bairro">Bairro:</label>
        <input type="text" v-model="paciente.bairro" id="bairro" required />

        <div class="new-line">
          <label for="complemento">Complemento:</label>
          <input type="text" v-model="paciente.complemento" id="complemento" />
        </div>
      </div>
      <br />

      <header>
        <img src="../components/icons/telefone.png" alt="icon-info" class="form-icon" />
        Contato
      </header>
      <div class="form-cont">
        <label for="email">E-Mail:</label>
        <input
          type="email"
          v-model="paciente.email"
          id="email"
          required
          :class="{ 'invalid-input': !isEmailValid && paciente.email !== '' }"
          @input="validateEmail"
        />
        <small v-if="!isEmailValid && paciente.email !== ''" class="error-message">
          E-mail inválido
        </small>

        <label for="tel1">Telefone:</label>
        <input
          type="text"
          v-model="paciente.tel1"
          id="tel1"
          required
          placeholder="(XX) XXXXX-XXXX"
          style="width: 150px;"
          :class="{ 'invalid-input': !isTelefone1Valid && paciente.tel1 !== '' }"
          @input="formatTelefone('tel1')"
        />
        <small v-if="!isTelefone1Valid && paciente.tel1 !== ''" class="error-message">
          Telefone inválido
        </small>

        <div class="new-line">
          <label for="tel2">Telefone 2:</label>
          <input
            type="text"
            v-model="paciente.tel2"
            id="tel2"
            placeholder="(XX) XXXXX-XXXX"
            style="width: 150px;"
            :class="{ 'invalid-input': !isTelefone2Valid && paciente.tel2 !== '' }"
            @input="formatTelefone('tel2')"
          />
          <small v-if="!isTelefone2Valid && paciente.tel2 !== ''" class="error-message">
            Telefone inválido
          </small>
        </div>
      </div>
    </div>

    <div class="botao">
      <button id="salvar" @click="salvarPaciente">Salvar</button>
      <button id="cancelar" @click="cancelarEdicao">Cancelar</button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default {
  name: 'CadastroPView',
  components: {
    NavBar
  },
  data() {
    return {
      photoUrl: '', // URL da foto do paciente
      paciente: {
        nome: '',
        cpf: '',
        sexo: '',
        datNasc: '',
        rg: '',
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
      isCpfValid: true,
      isEmailValid: true,
      isTelefone1Valid: true,
      isTelefone2Valid: true
    };
  },
  watch: {
    'paciente.cpf'(newCpf) {
      this.isCpfValid = this.validateCPF(newCpf);
    },
    'paciente.cep'(newCep) {
      // Remove caracteres não numéricos
      const cep = newCep.replace(/\D/g, '');
      if (cep.length === 8) {
        this.fetchAddressData(cep);
      } else {
        // Limpa os campos se o CEP não tiver 8 dígitos
        this.paciente.estado = '';
        this.paciente.cidade = '';
        this.paciente.rua = '';
        this.paciente.bairro = '';
        this.paciente.complemento = '';
      }
    }
  },
  methods: {
    validateCPF(cpf) {
      // Remove caracteres não numéricos
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf === '') return false;
      // Elimina CPFs inválidos conhecidos
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
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
      const email = this.paciente.email;
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.isEmailValid = re.test(email);
    },
    formatTelefone(field) {
      let telefone = this.paciente[field];

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

      this.paciente[field] = telefone;

      // Valida o telefone
      if (field === 'tel1') {
        this.isTelefone1Valid = this.validateTelefone(telefone);
      } else if (field === 'tel2') {
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
          this.paciente.estado = data.uf;
          this.paciente.cidade = data.localidade;
          this.paciente.rua = data.logradouro;
          this.paciente.bairro = data.bairro;
          this.paciente.complemento = data.complemento;
        } else {
          alert('CEP não encontrado.');
          // Limpa os campos caso o CEP não seja encontrado
          this.paciente.estado = '';
          this.paciente.cidade = '';
          this.paciente.rua = '';
          this.paciente.bairro = '';
          this.paciente.complemento = '';
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert('Ocorreu um erro ao buscar o CEP. Por favor, verifique o CEP e tente novamente.');
      }
    },
    async salvarPaciente() {
      // Verifica se todos os campos estão válidos
      if (!this.isCpfValid || !this.isEmailValid || !this.isTelefone1Valid) {
        alert('Por favor, corrija os campos inválidos antes de salvar.');
        return;
      }
      try {
        const url = this.paciente.id
          ? `http://localhost:3000/api/pacientes/${this.paciente.id}`
          : 'http://localhost:3000/api/pacientes';
        const method = this.paciente.id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.paciente)
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar paciente');
        }

        const data = await response.json();
        console.log('Paciente salvo:', data);
        alert('Paciente salvo com sucesso!');
        this.resetForm();
      } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar paciente. Verifique os dados e tente novamente.');
      }
    },
    cancelarEdicao() {
      this.resetForm();
    },
    resetForm() {
      this.paciente = {
        nome: '',
        cpf: '',
        sexo: '',
        datNasc: '',
        rg: '',
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
      this.isCpfValid = true;
      this.isEmailValid = true;
      this.isTelefone1Valid = true;
      this.isTelefone2Valid = true;
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.content {
  position: fixed;
  top: 0px;
  left: 50px;
  padding: 20px;
}

.photo-container {
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(240, 240, 240);
}

.photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 3px solid black;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-buttons button {
  margin: 5px;
  cursor: pointer;
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
.form-cont {
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