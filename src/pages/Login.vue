<template>
  <div class="box">
    <div class="container">
      <div class="top-">
        <header>OdontoTech</header><br>
      </div>
      <div class="input-field">
        <input type="text" class="input" placeholder="Login" required v-model="username">
        <i class="bx bx-user"><img src="../components/icons/do-utilizador.png" alt="icon-user"></i>
      </div>
      <div class="input-field">
        <input type="password" class="input" placeholder="Senha" required v-model="password">
        <i class="bx bx-lock-alt"><img src="../components/icons/chave-inteligente.png" alt="icon-psw"></i>
      </div>
      <div class="input-field">
        <input type="submit" class="submit" value="Entrar" @click="handleLogin">
      </div>
      <div class="bottom">
        <div class="left">
          <input type="checkbox" id="check">
          <label for="check">Salvar acesso</label>
        </div>
        <div class="right">
          <label><a href="#">Esqueceu a senha?</a></label>
        </div>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isLoggedIn: false
    };
  },
  methods: {
    handleLogin() {
      // Simulação de autenticação
      if (this.username === 'user' && this.password === 'password') {
        this.isLoggedIn = true;
        this.errorMessage = '';
        alert('Login bem-sucedido!');
      } else {
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.container {
  position: absolute;
  width: 350px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

header {
  color: #fff;
  font-size: 30px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  cursor: default;
}

.input {
  height: 45px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 30px;
  color: #fff;
  padding-left: 42px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.input-field {
  position: relative;
}

.input-field i {
  position: absolute;
  top: 13px;
  left: 15px;
  color: #fff;
}

.input-field i img {
  width: 20px;
  height: 20px;
  filter: invert(100%) brightness(2);
}

::placeholder {
  color: #fff;
}

.submit {
  border: none;
  border-radius: 30px;
  font-size: 15px;
  height: 45px;
  outline: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: 0.3s;
  color: #fff;
}

.submit:hover {
  box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.2);
  color: black;
}

.bottom {
  display: flex;
  justify-content: space-between;
  font-size: small;
  color: #fff;
  margin-top: 10px;
}

.left,
.right {
  display: flex;
  align-items: center;
}

label a {
  color: #fff;
  text-decoration: none;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
