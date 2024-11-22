// cypress/e2e/navbar.cy.js

describe('Teste da Navbar', () => {
    beforeEach(() => {
      // Executa o login antes de cada teste
      cy.visit('http://localhost:5173/');
      cy.get('input[name="username"]').type('Synkro');
      cy.get('input[name="password"]').type('away');
      cy.get('button[type="submit"]').click();
    });
  
    it('Deve navegar para a página de Cadastro de Pacientes', () => {
      // Expandir o submenu de Cadastro
      cy.get('.navbar-item').contains('Cadastro').click();
  
      // Clicar na opção Pacientes
      cy.contains('a', 'Pacientes').click();
  
      // Verificar se a URL está correta
      cy.url().should('include', '/cadastro-pacientes');
  
      // Verificar se a página possui algum elemento específico
      cy.get('h1').should('contain', 'Cadastro de Pacientes');
    });
  
    it('Deve navegar para a página de Consultas', () => {
      cy.get('a').contains('Consultas').click();
      cy.url().should('include', '/consultas');
      cy.get('h1').should('contain', 'Consultas');
    });
  
    // Continue adicionando testes para cada item da navbar
  });
  