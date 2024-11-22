// cypress/e2e/agendar_consulta.cy.js

describe('Teste de Agendamento de Consulta', () => {
  before(() => {
    // Executa o login uma vez antes de todos os testes
    cy.visit('http://localhost:5173/');
    cy.get('input.input[placeholder="Login"]').type('Synkro');
    cy.get('input.input[placeholder="Senha"]').type('away');
    cy.get('input[type="submit"]').click();

    // Verificar se o usuário foi redirecionado para a página inicial
    cy.url().should('include', '/home');
  });

  it('Deve cadastrar um novo paciente e agendar uma consulta', () => {
    // Gerar CPF e email únicos
    const cpfGerado = gerarCPF(); // Função para gerar CPF válido
    const timestamp = Date.now();
    const emailGerado = `joao${timestamp}@example.com`;

    // Navegar para a página de cadastro de pacientes
    cy.contains('Cadastro').click(); // Clicar em "Cadastro" na navbar
    cy.contains('Pacientes').click(); // Selecionar "Pacientes" no submenu

    // Verificar se está na página de cadastro de pacientes
    cy.url().should('include', '/cadastro-pacientes');

    // Preencher o formulário de cadastro de paciente
    cy.get('input#nome').type('João da Silva');
    cy.get('input#cpf').type(cpfGerado);
    cy.get('select#sexo').select('Homem');
    cy.get('input#dtnasc').type('1990-01-01');
    cy.get('input#rg').type(`${timestamp}`);

    // Interceptar a requisição ao ViaCEP
    cy.intercept('GET', 'https://viacep.com.br/ws/**').as('getViaCep');

    // Preencher o CEP
    cy.get('input#cep').type('01001-000');

    // Aguardar a conclusão da requisição ao ViaCEP
    cy.wait('@getViaCep').then((interception) => {
      // Aqui podemos acessar a resposta da interceptação
      const responseBody = interception.response.body;
      cy.log('Resposta do ViaCEP:', JSON.stringify(responseBody));

      // Opcional: Verificar se a resposta contém os dados esperados
      expect(responseBody).to.have.property('logradouro').and.not.be.empty;
    });

    // Aguardar até que o campo 'estado' tenha o valor 'SP'
    cy.get('input#estado', { timeout: 10000 }).should('have.value', 'SP');

    // Verificar o campo 'cidade'
    cy.get('input#cidade').should('have.value', 'São Paulo');

    // Aguardar até que o campo 'rua' tenha um valor
    cy.get('input#rua', { timeout: 10000 }).should('have.value').and('not.be.empty');

    // Verificar que o campo 'rua' tem o valor esperado
    cy.get('input#rua').should('have.value', 'Praça da Sé');

    // Verificar o campo 'bairro'
    cy.get('input#bairro').should('have.value').and('not.be.empty');

    // Preencher o número da residência
    cy.get('input#num').type('100');

    // Preencher o complemento (se necessário)
    cy.get('input#complemento').type('Apartamento 101');

    // Preencher Email único
    cy.get('input#email').type(emailGerado);

    // Preencher Telefone válido
    cy.get('input#tel1').type('(11) 99999-9999');

    // Preencher Telefone 2 (opcional)
    cy.get('input#tel2').type('(11) 98888-8888');

    // Interceptar a requisição para salvar o paciente
    cy.intercept('POST', '**/api/pacientes').as('savePaciente');

    // Submeter o formulário
    cy.get('button#salvar').click();

    // Aguardar a resposta do backend
    cy.wait('@savePaciente').then((interception) => {
      const { statusCode, body } = interception.response;
      cy.log('Status Code:', statusCode);
      cy.log('Response Body:', body);

      // Verificar se a resposta foi bem-sucedida
      expect(statusCode).to.equal(200);
    });

    // Verificar se o paciente foi salvo com sucesso
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Paciente salvo com sucesso!');
    });

    // Aguarda um curto período para garantir que o paciente foi salvo
    cy.wait(1000);

    // Navegar para a página de consultas
    cy.contains('Consultas').click();

    // Verificar se está na página de consultas
    cy.url().should('include', '/consultas');

    // Clicar no botão de agendar nova consulta
    cy.contains('button', 'Agendar Consulta').click();

    // Interceptar a requisição de busca de pacientes
    cy.intercept('GET', '**/api/pacientes/buscar/**').as('buscarPaciente');

    // Preencher o campo Paciente
    cy.get('input[placeholder="Digite o nome do paciente"]').type('João da Silva');

    // Aguardar até que a requisição de busca seja concluída
    cy.wait('@buscarPaciente');

    // Selecionar o paciente na lista de sugestões
    cy.get('.suggestions li').contains('João da Silva').click();

    // Preencher o campo Dia
    const dataConsulta = '2023-12-01';
    cy.get('input[type="date"]').type(dataConsulta);

    // Preencher o campo Horário
    cy.get('select').eq(0).select('10:00');

    // Preencher o campo Procedimento
    cy.get('select').eq(1).select('Limpeza Dental');

    // Preencher o campo Dentista Responsável
    cy.get('select').eq(2).select('Dra. Maria');

    // Interceptar a requisição para agendar a consulta
    cy.intercept('POST', '**/api/consultas').as('agendarConsulta');

    // Submeter o formulário
    cy.get('button[type="submit"]').contains('Salvar').click();

    // Aguardar a resposta do backend
    cy.wait('@agendarConsulta').then((interception) => {
      const { statusCode, body } = interception.response;
      cy.log('Status Code:', statusCode);
      cy.log('Response Body:', body);

      // Verificar se a resposta foi bem-sucedida
      expect(statusCode).to.equal(200);
    });

    // Verificar se a consulta foi agendada com sucesso
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Consulta agendada com sucesso!');
    });
  });
});

// Função para gerar CPF válido aleatório
function gerarCPF() {
  let cpf = [];
  for (let i = 0; i < 9; i++) {
    cpf.push(Math.floor(Math.random() * 9));
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += cpf[i] * (10 - i);
  }
  let resto = soma % 11;
  cpf[9] = resto < 2 ? 0 : 11 - resto;

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += cpf[i] * (11 - i);
  }
  resto = soma % 11;
  cpf[10] = resto < 2 ? 0 : 11 - resto;

  return cpf.join('');
}
