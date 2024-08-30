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
    <div class="back"></div>

    <!-- Substituição da div buscar -->
    <div class="buscar">
      <div class="select">
        <select v-model="selectedPaciente" @change="onPacienteChange">
          <option value="">Selecione um Paciente</option>
          <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
            {{ paciente.nome }}
          </option>
        </select>
      </div>
    </div>

    <div class="action">
      <div class="action-bar">
        <button id="ficha">Ficha Clínica</button>
        <button id="odontograma">Odontograma</button>
        <button id="fotos">Fotos</button>
        <button id="more">Paciente</button>
      </div>
    </div>

    <!-- Formulário de Paciente -->
    <div class="paciente-info" v-if="selectedPaciente">
      <div class="container-form">
        <div class="info">
          <header><img src="../components/icons/informacoes.png" alt="icon-info" class="form-icon">Informações</header>
          <div class="form-info">
            <label for="nome">Nome:</label>
            <input type="text" v-model="paciente.nome" id="nome" required :disabled="!isEditable">
            <label for="cpf">CPF:</label>
            <input type="text" v-model="paciente.cpf" id="cpf" required placeholder="XXX.XXX.XXX-XX" :disabled="!isEditable">
            <label for="sexo">Sexo:</label>
            <select v-model="paciente.sexo" id="sexo" required :disabled="!isEditable">
              <option value="-">-</option>
              <option value="Homem">Homem</option>
              <option value="Mulher">Mulher</option>
            </select>
            <label for="dtnasc">Data Nascimento:</label>
            <input type="date" v-model="paciente.datNasc" id="dtnasc" required :disabled="!isEditable">
            <label for="rg">RG:</label>
            <input type="text" v-model="paciente.rg" id="rg" required style="width: 130px;" :disabled="!isEditable">
          </div>
        </div><br>

        <br>
        <header><img src="../components/icons/mapas-e-bandeiras.png" alt="icon-info" class="form-icon">Endereço</header>
        <div class="form-en">
          <label for="cep">CEP:</label>
          <input type="text" v-model="paciente.cep" id="cep" required placeholder="XXXXX-XXX" :disabled="!isEditable">
          <label for="estado">Estado:</label>
          <select v-model="paciente.estado" id="estado" required :disabled="!isEditable">
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
          <input type="text" v-model="paciente.cidade" id="cidade" required :disabled="!isEditable">
          <div class="new-line">
            <label for="rua">Rua:</label>
            <input type="text" v-model="paciente.rua" id="rua" required :disabled="!isEditable">
          </div>
          <label for="num">N.:</label>
          <input type="text" v-model="paciente.num" id="num" required style="width: 100px;" :disabled="!isEditable">
          <label for="bairro">Bairro:</label>
          <input type="text" v-model="paciente.bairro" id="bairro" required :disabled="!isEditable">
          <div class="new-line">
            <label for="complemento">Complemento:</label>
            <input type="text" v-model="paciente.complemento" id="complemento" :disabled="!isEditable">
          </div>
        </div><br>

        <br>
        <header><img src="../components/icons/telefone.png" alt="icon-info" class="form-icon">Contato</header>
        <div class="form-cont">
          <label for="email">E-Mail:</label>
          <input type="text" v-model="paciente.email" id="email" required :disabled="!isEditable">
          <label for="tel1">Telefone:</label>
          <input type="text" v-model="paciente.tel1" id="tel1" required placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
          <div class="new-line">
            <label for="tel2">Telefone 2:</label>
            <input type="text" v-model="paciente.tel2" id="tel2" placeholder="(XX) XXXXX-XXXX" style="width: 150px;" :disabled="!isEditable">
          </div>
        </div>
        
        <!-- Botões de Ação -->
        <div class="botao">
          <button @click="editarPaciente" v-if="selectedPaciente">{{ isEditable ? 'Salvar' : 'Editar' }}</button>
          <button @click="excluirPaciente" v-if="selectedPaciente">Excluir</button>
          <button @click="voltar">Voltar</button>
          <button id="cancelar" @click="cancelarEdicao" v-if="isEditable">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'PacientesView',
  components: {
    NavBar,
  },
  data() {
    return {
      photoUrl: null,
      pacientes: [], // Array para armazenar os pacientes do backend
      selectedPaciente: '', // ID do paciente selecionado
      isEditable: false, // Controle para modo de edição
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
      }
    };
  },
  methods: {
    async fetchPacientes() {
      try {
        const response = await fetch('http://localhost:3000/api/pacientes');
        if (!response.ok) throw new Error('Erro ao buscar pacientes');
        const data = await response.json();
        this.pacientes = data; // Atribuir os pacientes retornados pelo backend
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    },
    deletePhoto() {
      this.photoUrl = null;
    },
    changePhoto() {
      // Lógica para alterar foto
    },
    onPacienteChange() {
      const pacienteSelecionado = this.pacientes.find(p => p.id === this.selectedPaciente);
      if (pacienteSelecionado) {
        this.paciente = {
          ...pacienteSelecionado,
          datNasc: pacienteSelecionado.datNasc ? new Date(pacienteSelecionado.datNasc).toISOString().split('T')[0] : '',
        };
      }
    },
    async editarPaciente() {
      if (this.isEditable) {
        // Salva as alterações do paciente
        try {
          const response = await fetch(`http://localhost:3000/api/pacientes/${this.selectedPaciente}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.paciente)
          });

          if (!response.ok) throw new Error('Erro ao salvar paciente');
          alert('Paciente atualizado com sucesso!');
          this.isEditable = false; // Desativa o modo de edição após salvar
          this.onPacienteChange(); // Recarrega os dados do paciente atualizado
        } catch (error) {
          console.error('Erro ao salvar paciente:', error);
          alert('Erro ao salvar paciente. Verifique os dados e tente novamente.');
        }
      } else {
        this.isEditable = true; // Ativa o modo de edição
      }
    },
    async excluirPaciente() {
      if (confirm('Tem certeza que deseja excluir este paciente?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/pacientes/${this.selectedPaciente}`, {
            method: 'DELETE'
          });

          if (!response.ok) throw new Error('Erro ao excluir paciente');
          alert('Paciente excluído com sucesso!');
          this.fetchPacientes(); // Atualiza a lista de pacientes
          this.selectedPaciente = ''; // Limpa a seleção
          this.paciente = {}; // Limpa os dados do formulário
        } catch (error) {
          console.error('Erro ao excluir paciente:', error);
          alert('Erro ao excluir paciente. Tente novamente.');
        }
      }
    },
    voltar() {
      // Lógica para voltar à página anterior ou limpar a seleção
      this.selectedPaciente = '';
      this.isEditable = false;
      this.paciente = {};
    },
    cancelarEdicao() {
      this.isEditable = false;
      this.onPacienteChange(); // Recarregar os dados do paciente para cancelar as alterações
    }
  },
  mounted() {
    this.fetchPacientes();
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
  top: 30px;
  left: 450px;
  padding: 20px;
  z-index: 2;
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

.back {
  background: rgb(229, 240, 253);
  position: fixed;
  top: 0px;
  left: 250px;
  width: 1150px;
  height: 1000px;
  z-index: 1;
}

.buscar {
  position: fixed;
  top: 0;
  left: 250px;
  width: 100%;
  height: 40px;
  background: #fff;
  border: 1px solid black;
  z-index: 2;
}

.select {
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-top: 4px;
}

.select select {
  padding: 5px;
  font-size: 14px;
}

.action {
  position: fixed;
  top: 230px;
  left: 250px;
  width: calc(100% - 250px);
  z-index: 2;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border: 1px solid black;
}

.action-bar button {
  background: transparent;
  color: rgb(48, 48, 255);
  cursor: pointer;
  border: none;
  font-size: inherit;
  padding: 13px 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  transition: all 0.3s;
}

.action-bar button:hover {
  background-color: #08396b;
  color: #fff;
}

.action-bar button:active {
  background-color: #08396b;
  top: 2px;
}

.paciente-info {
  position: relative;
  z-index: 3;
  margin-top: 30px;
  padding: 20px;
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
</style>
