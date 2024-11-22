// cypress/e2e/gerenciarPaciente.cy.js

describe('Gerenciamento de Pacientes', () => {
    before(() => {
      // Executa o login antes de todos os testes
      cy.visit('http://localhost:5173/');
      cy.get('input.input[placeholder="Login"]').type('Synkro');
      cy.get('input.input[placeholder="Senha"]').type('away');
      cy.get('input[type="submit"]').click();
  
      // Verificar se o usuário foi redirecionado para a página inicial
      cy.url().should('include', '/home');
    });
  
    beforeEach(() => {
      // Interceptar a requisição para obter a lista de pacientes
      cy.intercept('GET', '**/api/pacientes**').as('getPacientes');
  
      // Navegar para a página de pacientes
      cy.contains('Pacientes').click();
  
      // Verificar se está na página de pacientes
      cy.url().should('include', '/pacientes');
  
      // Aguardar a resposta da requisição
      cy.wait('@getPacientes').then((interception) => {
        const { statusCode, body } = interception.response;
        expect(statusCode).to.equal(200);
        expect(body).to.be.an('array').and.to.have.length.greaterThan(0);
  
        // Selecionar o primeiro paciente na lista
        const paciente = body[0];
        cy.wrap(paciente).as('paciente'); // Salvar o paciente para uso nos testes
        cy.get('select').select(paciente.id.toString());
  
        // Verificar se as informações do paciente são exibidas corretamente
        cy.get('input#nome').should('have.value', paciente.nome);
        cy.get('input#cpf').should('have.value', paciente.cpf);
        // Continue verificando outros campos conforme necessário
      });
    });
  
    it('Deve selecionar um paciente e exibir suas informações', function () {
      // O estado já foi configurado no beforeEach
      // Você pode adicionar asserções adicionais aqui, se necessário
    });
  
    it('Deve editar as informações do paciente', function () {
      // Pressionar o botão 'Editar'
      cy.contains('button', 'Editar').click();
  
      // Verificar se os campos estão editáveis
      cy.get('input#nome').should('not.be.disabled');
  
      // Editar o campo 'Nome'
      cy.get('input#nome').clear().type('Nome Editado');
  
      // Interceptar a requisição de atualização do paciente
      cy.intercept('PUT', '**/api/pacientes/**').as('updatePaciente');
  
      // Submeter as alterações
      cy.contains('button', 'Salvar').click();
  
      // Aguardar a resposta do backend
      cy.wait('@updatePaciente').then((interception) => {
        const { statusCode } = interception.response;
        expect(statusCode).to.equal(200);
      });
  
      // Verificar se o paciente foi atualizado com sucesso
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Paciente atualizado com sucesso!');
      });
  
      // Verificar se o nome foi atualizado no campo
      cy.get('input#nome').should('have.value', 'Nome Editado');
    });
  
    it('Deve visualizar o histórico de procedimentos do paciente', function () {
      // Clicar no botão 'Histórico de Procedimentos'
      cy.contains('button', 'Histórico de Procedimentos').click();
  
      // Interceptar as requisições para obter o histórico
      cy.intercept('GET', '**/api/odontogramas/**').as('getOdontograma');
      cy.intercept('GET', '**/api/consultas**').as('getConsultas');
  
      // Aguardar as respostas
      cy.wait('@getOdontograma').then((interception) => {
        const { statusCode, body } = interception.response;
        expect(statusCode).to.equal(200);
        expect(body).to.be.an('array');
      });
  
      cy.wait('@getConsultas').then((interception) => {
        const { statusCode, body } = interception.response;
        expect(statusCode).to.equal(200);
        expect(body).to.be.an('array');
      });
  
      // Verificar se o histórico é exibido
      cy.get('.historico-procedimentos').should('be.visible');
  
      // Verificar se a tabela contém dados
      cy.get('.historico-procedimentos table tbody tr').should('have.length.greaterThan', 0);
  
      // Fechar o histórico
      cy.get('.fechar-botao').click();
  
      // Verificar se o histórico foi fechado
      cy.get('.historico-procedimentos').should('not.exist');
    });
  
    it('Deve abrir o modal de Odontograma', function () {
      // Clicar no botão 'Odontograma'
      cy.contains('button', 'Odontograma').click();
  
      // Verificar se o modal é exibido
      cy.get('.modal-overlay').should('be.visible');
  
      // Fechar o modal
      cy.get('.modal-overlay').click('topLeft');
  
      // Verificar se o modal foi fechado
      cy.get('.modal-overlay').should('not.exist');
    });
  
    it('Deve excluir um paciente', function () {
      // Clicar no botão 'Excluir'
      cy.contains('button', 'Excluir').click();
  
      // Confirmar a exclusão
      cy.on('window:confirm', () => true);
  
      // Interceptar a requisição de exclusão
      cy.intercept('DELETE', '**/api/pacientes/**').as('deletePaciente');
  
      // Aguardar a resposta do backend
      cy.wait('@deletePaciente').then((interception) => {
        const { statusCode } = interception.response;
        expect(statusCode).to.equal(200);
      });
  
      // Verificar se o paciente foi excluído com sucesso
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Paciente excluído com sucesso!');
      });
  
      // Verificar se o paciente não está mais na lista
      cy.get('select').should('not.contain', 'Nome Editado');
    });
  });
  