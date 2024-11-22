// cypress/e2e/cadastro_paciente.cy.js

describe('Teste de Cadastro de Paciente', () => {
    beforeEach(() => {
      // Executa o login antes de cada teste
      cy.visit('http://localhost:5173/');
      cy.get('input[name="username"]').type('Synkro');
      cy.get('input[name="password"]').type('away');
      cy.get('button[type="submit"]').click();
  
      // Navegar para a página de cadastro de pacientes
      cy.get('.navbar-item').contains('Cadastro').click();
      cy.contains('a', 'Pacientes').click();
    });
  
    it('Deve cadastrar um novo paciente', () => {
      // Preencher o formulário de cadastro
      cy.get('input[name="nome"]').type('João da Silva');
      cy.get('input[name="cpf"]').type('12345678900');
      cy.get('input[name="datNasc"]').type('1990-01-01');
      cy.get('input[name="email"]').type('joao@example.com');
      cy.get('input[name="tel1"]').type('11999999999');
      // Preencha os demais campos necessários
  
      // Submeter o formulário
      cy.get('button[type="submit"]').click();
  
      // Verificar se o paciente foi cadastrado com sucesso
      cy.contains('Paciente cadastrado com sucesso').should('be.visible');
    });
  });
  