<template>
  <div class="box">
    <div class="container">
      <div class="top-">
        <span>Have an accout?</span>
        <header>Login</header>
      </div>
      <div class="input-field">
        <input type="text" class="input" placeholder="Username" required>
        <i class="bx bx-user"></i> <!--Img de usuário-->
      </div>
      <div class="input-field">
        <input type="password" class="input" placeholder="Password" required>
        <i class="bx bx-lock-alt"></i> <!--Img de cadeado-->
      </div>
      <div class="input-field">
        <input type="submit" class="submit" value="Login">
      </div>
      <div class="but">
        <div class="left">
          <input type="checkbox" id="check">
          <label for="check">Remember Me</label>
        </div>
        <div class="right">
          <label><a href="#">Forgot password?</a></label>
        </div>
      </div>
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

<style>
*{
  font-family: 'Poppins', sans serif;
}

body{
  background-color: blue; /*Definir fundo da tela de login*/
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}

.box{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}

.container{
  width: 350px;
  display: flex;
  flex-direction: column;
  padding: 0 15px 0 15px;
}

span{
  color: #fff;
  font-size: small;
  display: flex;
  justify-content: center;
  padding: 10px 0 10px 0;
}

header{
  color: #fff;
  font-size: 30px;
  display: flex;
  justify-content: center;
  padding: 10px 0 10px  0;
}

.input{
  height: 45px;
  width: 87%;
  border: none;
  outline: none;
  border-radius: 30px;
  color: #fff;
  padding: 0 0 0 42px;
  background: rgba(255, 255, 255, 0.1);
}

.input-field{
  display: flex;
  flex-direction: column;
}

/*i{
  position: relative;
  top: -31px;
  left: 17px;
  color: #fff;
} -> Imagens da tela */

 ::-webkit-input-placeholder{
  color: #fff;
 }

 .submit{
  border: none;
  border-radius: 30px;
  font-size: 15px;
  height: 45px;
  outline: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: .3s;
 }

 .submit:hover{
  box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.2)
 }

 .botton{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: small;
  color: #fff;
  margin-top: 10px;
 }

 .left{
  display: flex;
 }

 label a {
  color: #fff;
  text-decoration: none;
 }
</style>
