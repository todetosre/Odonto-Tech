<template>
  <div>
    <NavBar />
    <div class="content">
      <div class="photo-container">
        <div class="photo">
          <img :src="photoUrl" alt="Foto do Paciente" v-if="photoUrl" />
        </div>
        <div class="photo-buttons">
          <button @click="deletePhoto">Deletar</button>
          <button @click="changePhoto">Alterar</button>
        </div>
      </div>
    </div>

    <div class="container-form">
      <div class="info">
        <header><img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon">Informações</header>
        <div class="form-info">
          <label for="nome">Nome:</label>
          <input type="text" v-model="paciente.nome" id="nome" required>
          <label for="cpf">CPF:</label>
          <input type="text" v-model="paciente.cpf" id="cpf" required placeholder="XXX.XXX.XXX-XX">
          <span v-if="cpfError" style="color: red;">{{ cpfError }}</span>
          <label for="sexo">Sexo:</label>
          <select v-model="paciente.sexo" id="sexo" required>
            <option value="-">-</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
          </select>
          <label for="dtnasc">Data Nascimento:</label>
          <input type="date" v-model="paciente.datNasc" id="dtnasc" required>
          <label for="rg">RG:</label>
          <input type="text" v-model="paciente.rg" id="rg" required style="width: 130px;">
        </div>
      </div><br>

      <br>
      <header><img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon">Endereço</header>
      <div class="form-en">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" v-model="formData.cep" required placeholder="XXXXX-XXX">
        <label for="estado">Estado:</label>
        <input type="text" id="estado" v-model="formData.estado" readonly required>
        <label for="cidade">Cidade:</label>
        <input type="text" id="cidade" v-model="formData.cidade" readonly required>
        <div class="new-line">
          <label for="rua">Rua:</label>
          <input type="text" id="rua" v-model="formData.rua" readonly required>
        </div>
        <label for="num">N.:</label>
        <input type="text" id="num" v-model="formData.numero" required style="width: 100px;">
        <label for="bairro">Bairro:</label>
        <input type="text" id="bairro" v-model="formData.bairro" readonly required>
        <div class="new-line">
          <label for="complemento">Complemento:</label>
          <input type="text" id="complemento" v-model="formData.complemento">
        </div>
      </div>

      <br>
      <header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
      <div class="form-cont">
        <label for="email">E-Mail:</label>
        <input type="text" v-model="paciente.email" id="email" required>
        <label for="tel1">Telefone:</label>
        <input type="text" v-model="paciente.tel1" id="tel1" required placeholder="(XX) XXXXX-XXXX"
          style="width: 150px;">
        <div class="new-line">
          <label for="tel2">Telefone 2:</label>
          <input type="text" v-model="paciente.tel2" id="tel2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;">
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
      photoUrl: '',
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
      cpfError: '',
    };
  },
  methods: {
    async salvarPaciente() {
      this.validarCPF();
      if (this.cpfError) {
        alert('Por favor, corrija os erros antes de enviar o formulário.');
        return;
      }
      try {
        const url = this.paciente.id ? `http://localhost:3000/api/pacientes/${this.paciente.id}` : 'http://localhost:3000/api/pacientes';
        const method = this.paciente.id ? 'PUT' : 'POST';

        const response = await axios({
          method,
          url,
          data: this.paciente
        });

        if (response.status >= 200 && response.status < 300) {
          alert('Paciente salvo com sucesso!');
          this.resetForm();
        } else {
          alert('Erro ao salvar paciente.');
        }
      } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar paciente. Verifique os dados e tente novamente.');
      }
    },
    cancelarEdicao() {
      this.resetForm();
      this.$router.push('/home'); // Redireciona para a tela inicial
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
      this.cpfError = '';
    },
    validarCPF() {
      const cpf = this.paciente.cpf;
      const isValid = this.isCPFValid(cpf);
      if (!isValid) {
        this.cpfError = 'CPF inválido.';
      } else {
        this.cpfError = '';
      }
    },
    isCPFValid(cpf) {
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf == '') return false;
      if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
      let add = 0;
      for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
      let rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
        rev = 0;
      if (rev != parseInt(cpf.charAt(9)))
        return false;
      add = 0;
      for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
      rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
        rev = 0;
      if (rev != parseInt(cpf.charAt(10)))
        return false;
      return true;
    },
    async fetchAddress() {
      const cep = this.paciente.cep.replace(/\D/g, '');
      if (cep.length !== 8) {
        return;
      }
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          alert('CEP não encontrado.');
        } else {
          this.paciente.estado = response.data.uf;
          this.paciente.cidade = response.data.localidade;
          this.paciente.bairro = response.data.bairro;
          this.paciente.rua = response.data.logradouro;
          this.paciente.complemento = response.data.complemento;
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }
    },
    deletePhoto() {
      this.photoUrl = '';
    },
    changePhoto() {
      // Lógica para alterar a foto
    }
  },
  watch: {
    'paciente.cpf': function (newVal) {
      this.validarCPF();
    },
    'paciente.cep': function (newVal) {
      this.fetchAddress();
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
  /* Ajuste conforme necessário */
  left: 50px;
  /* Ajuste conforme a largura da navbar + padding */
  padding: 20px;
  /* Garante que fique acima de outros conteúdos */
}

.photo-container {
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(240, 240, 240)
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
  /* Linha abaixo da foto */
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
  /* Ajuste conforme necessário */
  padding: 10px 0;
  /* Ajuste conforme necessário */
  border-bottom: 3px solid black;
  /* Linha abaixo do header */
  width: 840px;
}

.form-icon {
  width: 20px;
  /* Ajuste conforme necessário */
  height: 20px;
  /* Ajuste conforme necessário */
  margin-right: 10px;
  /* Espaço entre a imagem e o texto */
}

.container-form {
  position: fixed;
  top: 10px;
  left: 490px;
  color: black;
}

.form-info {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 9px;
  /* Espaçamento entre os itens e as linhas */
}

.form-en {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px;
  /* Espaçamento entre os itens e as linhas */
}

.form-cont {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px;
  /* Espaçamento entre os itens e as linhas */
}

.new-line {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px;
  /* Espaçamento entre os itens e as linhas */
}

.botao {
  position: fixed;
  top: 530px;
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
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
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

#salvar:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#salvar:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
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
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
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

#cancelar:after {
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

#cancelar:before {
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}
</style>
