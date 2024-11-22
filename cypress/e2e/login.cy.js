// cypress/e2e/login.cy.js

describe('Teste de Login', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/');
    });
  
    it('Deve logar com credenciais válidas', () => {
      // Preencher o campo de usuário
      cy.get('input.input[placeholder="Login"]').type('Synkro');
  
      // Preencher o campo de senha
      cy.get('input.input[placeholder="Senha"]').type('away');
  
      // Submeter o formulário
      cy.get('input[type="submit"]').click();
  
      // Verificar se o usuário foi redirecionado para a página inicial
      cy.url().should('include', '/home');
  
      // Verificar se o nome do usuário está sendo exibido na navbar
      cy.get('.navbar-user').should('contain', 'Bem-Vindo(a), Synkro');
    });
  
    it('Deve mostrar uma mensagem de erro com credenciais inválidas', () => {
      // Preencher campos com dados inválidos
      cy.get('input.input[placeholder="Login"]').type('usuario_invalido');
      cy.get('input.input[placeholder="Senha"]').type('senha_invalida');
  
      // Submeter o formulário
      cy.get('input[type="submit"]').click();
  
      // Verificar se a mensagem de erro é exibida
      cy.get('.error')
        .should('be.visible')
        .and(($el) => {
          const text = $el.text();
          expect(text).to.match(/Usuário não encontrado|Senha incorreta|Erro ao autenticar usuário/);
        });
    });
  });
  