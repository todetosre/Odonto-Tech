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
  
  <div class="back" style="background: rgb(229, 240, 253); position: fixed; top: 0px; left: 250px; width: 1150px; height: 1000px;"></div>

  <div class="container-form">
    <div class="info">

      <header><img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon">Informações</header>
      <div class="form-info">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" required>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" required placeholder="XXX.XXX.XXX-XX">
        <label for="sexo">Sexo:</label>
        <select id="sexo" required>
          <option value="-">-</option>
          <option value="Homem">Homem</option>
          <option value="Mulher">Mulher</option>
        </select>
        <label for="dtnasc">Data Nascimento:</label>
        <input type="date" id="dtnasc" required>
        <label for="rg">RG:</label>
        <input type="text" id="rg" required style="width: 130px;">
        <label for="cro">CRO:</label>
        <input type="text" id="cro" required placeholder="XXXXX-XX" style="width: 130px;">
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
      <input type="text" id="cep" required placeholder="XXXXX-XXX">
      <label for="estado">Estado:</label>
      <select id="estado" required>
        <option value="-">-</option>
        <option value="ac">AC</option>
        <option value="al">AL</option>
        <option value="ap">AP</option>
        <option value="am">AM</option>
        <option value="ba">BA</option>
        <option value="ce">CE</option>
        <option value="df">DF</option>
        <option value="es">ES</option>
        <option value="go">GO</option>
        <option value="ma">MA</option>
        <option value="mt">MT</option>
        <option value="ms">MS</option>
        <option value="mg">MG</option>
        <option value="pa">PA</option>
        <option value="pb">PB</option>
        <option value="pr">PR</option>
        <option value="pe">PE</option>
        <option value="pi">PI</option>
        <option value="rj">RJ</option>
        <option value="rn">RN</option>
        <option value="rs">RS</option>
        <option value="ro">RO</option>
        <option value="rr">RR</option>
        <option value="sc">SC</option>
        <option value="sp">SP</option>
        <option value="se">SE</option>
        <option value="to">TO</option>
      </select>
      <label for="cidade">Cidade:</label>
      <input type="text" id="cidade" required>
      <div class="new-line">
        <label for="rua">Rua:</label>
        <input type="text" id="rua" required>
      </div>
      <label for="num">N.:</label>
      <input type="text" id="num" required style="width: 100px;">
      <label for="bairro">Bairro:</label>
      <input type="text" id="bairro" required>
      <div class="new-line">
        <label for="complemento">Complemento:</label>
        <input type="text" id="complemento" required>
      </div>
    </div>

    <br><header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
    <div class="form-cont">
      <label for="email">E-Mail:</label>
      <input type="text" id="email" required>
      <label for="tel1">Telefone:</label>
      <input type="text" id="tel1" required placeholder="(XX) XXXXX-XXXX" style="width: 150px;">
      <div class="new-line">
        <label for="tel2">Telefone 2:</label>
        <input type="text" id="tel2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;">
      </div>
    </div>

    <br><header><img src="../components/icons/emprestimo.png" alt="icon-info" class="form-icon">Dados Bancários</header>
    <div class="form-banc">
      <label for="cont-banc">Banco:</label>
      <input type="text" id="cont-banc" required placeholder="XXX" style="width: 50px;">
      <label for="agencia">Agência:</label>
      <input type="text" id="agencia" required placeholder="XXXX" style="width: 70px;">
      <label for="cont-corrente">Conta Corrente:</label>
      <input type="text" id="cont-corrente" required placeholder="Conta com Dígito" style="width: 150px;">
    </div>
  </div>
  <div class="botao">
    <button id="salvar">Salvar</button>
    <button id="cancelar">Cancelar</button>
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
  border-bottom: 3px solid black; /* Linha abaixo da foto */
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
  color: black; /* Ajuste conforme necessário */
  padding: 10px 0; /* Ajuste conforme necessário */
  border-bottom: 3px solid black; /* Linha abaixo do header */
  width: 840px;
}

.form-icon {
  width: 20px; /* Ajuste conforme necessário */
  height: 20px; /* Ajuste conforme necessário */
  margin-right: 10px; /* Espaço entre a imagem e o texto */
}

.container-form {
  position: fixed;
  top: 10px;
  left: 490px;
  color: black;
}

.form-info{
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 9px; /* Espaçamento entre os itens e as linhas */
}
.form-en{
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px; /* Espaçamento entre os itens e as linhas */
}
.form-cont{
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px; /* Espaçamento entre os itens e as linhas */
}
.form-banc {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px; /* Espaçamento entre os itens e as linhas */
}
.new-line{
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px; /* Espaçamento entre os itens e as linhas */
}

.botao{
  position: fixed;
  top: 530px;
}

#salvar{
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
#salvar:hover{
  background-color: #fff;
  color: green;
}
#salvar:active{
  background: green;
  top: 2px;
  color: #fff;
}
#salvar:after{
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}
#salvar:before{
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}

#cancelar{
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
#cancelar:hover{
  background-color: #fff;
  color: red;
  border-color: red;
}
#cancelar:active{
  background: red;
  top: 2px;
  color: #fff;
  border-color: red;
}
#cancelar:after{
  content: '';
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}
#cancelar:before{
  height: 100%;
  left: 0;
  top: 0;
  line-height: 3;
  font-size: 140%;
  width: 60px;
}
</style>
