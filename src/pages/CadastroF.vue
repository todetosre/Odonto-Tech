<template>
  <div>
    <NavBar />
    <div class="content">
      <div class="photo-container">
        <div class="photo">
          <img :src="photoUrl" alt="Foto do Funcionário" v-if="photoUrl" />
        </div>
        <div class="photo-buttons">
          <button @click="deletePhoto">Deletar</button>
          <button @click="changePhoto">Alterar</button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="container-form">
    <div class="info">
      <header><img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon">Informações</header>
      <div class="form-info">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" required>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" required>
        <label for="sexo">Sexo:</label>
        <select id="sexo" required>
          <option value="-">-</option>
          <option value="Homem">Homem</option>
          <option value="Mulher">Mulher</option>
        </select>
        <label for="dtnasc">Data Nascimento:</label>
        <input type="date" id="dtnasc" required>
        <label for="rg">RG:</label>
        <input type="text" id="rg">
        <label for="cro">CRO:</label>
        <input type="text" id="cro">
        <label for="funcao">Função:</label>
        <select id="funcao" required>
          <option value="-">-</option>
          <option value="Dentista">Dentista</option>
          <option value="Recepcionista">Recepcionista</option>
        </select>
      </div>
    </div>

    <br><header><img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon">Endereço</header>
    <div class="form-en">
      <label for="cep">CEP:</label>
      <input type="text" id="cep" required>
      <label for="estado">Estado:</label>
      <select id="estado" required>
        <option value="-">-</option> <!-- Fazer 1x option para cada estado -->
      </select>
      <label for="num">N.:</label>
      <input type="text" id="num" required>
      <label for="rua">Rua:</label>
      <input type="text" id="rua" required>
      <label for="cidade">Cidade:</label>
      <input type="text" id="cidade" required>
      <label for="bairro">Bairro:</label>
      <input type="text" id="bairro" required>
      <label for="complemento">Complemento:</label>
      <input type="text" id="complemento" required>
    </div>

    <br><header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
    <div class="form-cont">
      <label for="email">E-Mail:</label>
      <input type="text" id="email" required>
      <label for="tel1">Telefone:</label>
      <input type="text" id="tel1" required>
      <label for="tel2">Telefone 2:</label>
      <input type="text" id="tel2">
    </div>

    <br><header><img src="../components/icons/emprestimo.png" alt="icon-info" class="form-icon">Dados Bancários</header>
    <div class="form-banc">
      <label for="cont-banc">Banco:</label>
      <input type="text" id="cont-banc" required>
      <label for="agencia">Agência:</label>
      <input type="text" id="agencia" required>
      <label for="cont-corrente">Conta Corrente:</label>
      <input type="text" id="cont-corrente" required>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'CadastroFView',
  components: {
    NavBar
  },
  data() {
    return {
      photoUrl: '' // URL da foto do funcionário
    }
  },
  methods: {
    deletePhoto() {
      this.photoUrl = ''; // Lógica para deletar a foto
    },
    changePhoto() {
      // Lógica para alterar a foto, como abrir um diálogo para selecionar uma nova foto
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.content {
  position: fixed;
  top: 0px; /* Ajuste conforme necessário */
  left: 50px; /* Ajuste conforme a largura da navbar + padding */
  padding: 20px;
  z-index: 1; /* Garante que fique acima de outros conteúdos */
}

.photo-container {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border-bottom: 3px solid black; /* Linha abaixo da foto */
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-buttons button {
  margin: 5px;
}

header {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white; /* Ajuste conforme necessário */
  padding: 10px 0; /* Ajuste conforme necessário */
  border-bottom: 3px solid #fff; /* Linha abaixo do header */
  width: 500px;
}

.form-icon {
  width: 20px; /* Ajuste conforme necessário */
  height: 20px; /* Ajuste conforme necessário */
  margin-right: 10px; /* Espaço entre a imagem e o texto */
}

.container-form {
  position: fixed;
  top: 10px;
  left: 500px;
}

.form-info,
.form-en,
.form-cont,
.form-banc {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px; /* Espaçamento entre os itens e as linhas */
}

.form-info input,
.form-info select,
.form-en input,
.form-en select,
.form-cont input,
.form-banc input {
  display: inline-block; /* Mantém o label e input na mesma linha */
}

.form-info br,
.form-en br,
.form-cont br,
.form-banc br {
  display: none; /* Remove a quebra de linha adicionada pelo <br> */
}
</style>
