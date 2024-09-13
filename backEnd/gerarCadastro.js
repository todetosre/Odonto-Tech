const bcrypt = require('bcrypt');
const { Client } = require('pg');
const readline = require('readline');

// Configuração de conexão com o banco de dados PostgreSQL
const client = new Client({
  user: 'postgres', // Substitua pelo seu usuário do PostgreSQL
  host: 'localhost', // Substitua pelo seu host do PostgreSQL, se necessário
  database: 'DB_OdontoTech', // Substitua pelo nome do seu banco de dados
  password: 'unigran', // Substitua pela sua senha do PostgreSQL
  port: 5432, // Substitua pela sua porta do PostgreSQL, se necessário
});

// Função para gerar o hash da senha
async function gerarHash(senha) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(senha, salt);
  return hash;
}

// Função para criar um novo usuário
async function criarUsuario(nome, cpf, usuario, senha) {
  try {
    await client.connect();
    const hash = await gerarHash(senha);

    const query = `
      INSERT INTO users (nome, cpf, usuario, senha)
      VALUES ($1, $2, $3, $4)
    `;

    const values = [nome, cpf, usuario, hash];

    await client.query(query, values);

    console.log('Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
  } finally {
    await client.end();
  }
}

// Função para remover um usuário
async function removerUsuario(usuario) {
  try {
    await client.connect();

    // Remove o usuário da tabela 'users'
    await client.query('DELETE FROM users WHERE usuario = $1', [usuario]);

    // Ajustar a sequência para o próximo valor do ID
    await client.query(`
      SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users));
    `);

    console.log('Usuário removido com sucesso!');
  } catch (err) {
    console.error('Erro ao remover usuário:', err);
  } finally {
    await client.end();
  }
}

// Função para ler entradas do usuário no terminal
function lerEntrada(pergunta) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(pergunta, (resposta) => {
    rl.close();
    resolve(resposta);
  }));
}

// Função principal para executar o fluxo de cadastro e remoção
async function main() {
  try {
    const acao = await lerEntrada('Digite 1 para adicionar um usuário ou 2 para remover um usuário: ');

    if (acao === '1') {
      const nome = await lerEntrada('Digite o nome do usuário: ');
      const cpf = await lerEntrada('Digite o CPF do usuário: ');
      const usuario = await lerEntrada('Digite o login do usuário: ');
      const senha = await lerEntrada('Digite a senha do usuário: ');

      await criarUsuario(nome, cpf, usuario, senha);
    } else if (acao === '2') {
      const usuario = await lerEntrada('Digite o login do usuário a ser removido: ');

      await removerUsuario(usuario);
    } else {
      console.log('Opção inválida.');
    }
  } catch (err) {
    console.error('Erro:', err);
  }
}

main();
