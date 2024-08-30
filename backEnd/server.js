const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
const port = 3000;

// Middleware para parsear o body das requisições como JSON
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // Porta padrão do PostgreSQL
});

app.use(cors({
  origin: 'http://localhost:5173', // URL do seu front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//Funcionários
// Função para adicionar funcionário
async function addFuncionario(funcionario) {
    const sql = `
      INSERT INTO funcionarios (nome, cpf, "datNasc", rg, funcao, cep, estado, rua, num, cidade, bairro, complemento, email, tel1, tel2, banco, agencia, cro, sexo, "contCorrente")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `;
  
    const values = [
      funcionario.nome,
      funcionario.cpf,
      funcionario.dataNascimento, // Certifique-se de que este campo não está nulo
      funcionario.rg,
      funcionario.funcao,
      funcionario.cep,
      funcionario.estado,
      funcionario.rua,
      funcionario.numero,
      funcionario.cidade,
      funcionario.bairro,
      funcionario.complemento,
      funcionario.email,
      funcionario.telefone1,
      funcionario.telefone2,
      funcionario.banco,
      funcionario.agencia,
      funcionario.cro,
      funcionario.sexo,
      funcionario.contaCorrente,
    ];
  
    try {
      await db.query(sql, values);
      console.log('Funcionário adicionado com sucesso');
    } catch (err) {
      console.error('Erro ao inserir funcionário:', err);
    }
}

// Endpoint para cadastrar um funcionário
app.post('/api/funcionarios', async (req, res) => {
    try {
        await addFuncionario(req.body);
        res.status(201).send('Funcionário cadastrado com sucesso');  // Resposta de sucesso
    } catch (err) {
        console.error('Erro ao cadastrar funcionário:', err);
        res.status(500).send('Erro ao cadastrar funcionário');  // Resposta de erro
    }
});

// Endpoint para buscar todos os funcionários (com todos os dados)
app.get('/api/funcionarios', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM funcionarios");
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    res.status(500).send('Erro ao buscar funcionários');
  }
});

// Endpoint para buscar um funcionário pelo ID
app.get('/api/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        nome, 
        cpf, 
        TO_CHAR("datNasc", 'YYYY-MM-DD') as "dataNascimento", 
        rg, 
        funcao, 
        cep, 
        estado, 
        rua, 
        num as numero, 
        cidade, 
        bairro, 
        complemento, 
        email, 
        tel1 as telefone1, 
        tel2 as telefone2, 
        banco, 
        agencia, 
        cro, 
        sexo, 
        "contCorrente" as "contaCorrente" 
      FROM funcionarios 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Funcionário não encontrado');
    }
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).send('Erro ao buscar funcionário');
  }
});

// Endpoint para atualizar os dados de um funcionário
app.put('/api/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  const funcionario = req.body;
  const sql = `
    UPDATE funcionarios
    SET nome = $1, cpf = $2, "datNasc" = $3, rg = $4, funcao = $5, cep = $6, estado = $7, rua = $8, num = $9, cidade = $10, bairro = $11, complemento = $12, email = $13, tel1 = $14, tel2 = $15, banco = $16, agencia = $17, cro = $18, sexo = $19, "contCorrente" = $20
    WHERE id = $21
  `;
  const values = [
    funcionario.nome,
    funcionario.cpf,
    funcionario.dataNascimento,
    funcionario.rg,
    funcionario.funcao,
    funcionario.cep,
    funcionario.estado,
    funcionario.rua,
    funcionario.numero,
    funcionario.cidade,
    funcionario.bairro,
    funcionario.complemento,
    funcionario.email,
    funcionario.telefone1,
    funcionario.telefone2,
    funcionario.banco,
    funcionario.agencia,
    funcionario.cro,
    funcionario.sexo,
    funcionario.contaCorrente,
    id
  ];

  try {
    await db.query(sql, values);
    res.status(200).send('Funcionário atualizado com sucesso');
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).send('Erro ao atualizar funcionário');
  }
});


// Endpoint para excluir um funcionário pelo ID
app.delete('/api/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM funcionarios WHERE id = $1", [id]);
    res.status(200).send('Funcionário excluído com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir funcionário');
  }
});


//Pacientes
app.post('/api/pacientes', async (req, res) => {
  try {
    const paciente = req.body;
    const sql = `
      INSERT INTO pacientes (nome, cpf, sexo, "datNasc", rg, cep, estado, cidade, rua, num, bairro, complemento, email, tel1, tel2)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *
    `;
    const values = [
      paciente.nome,
      paciente.cpf,
      paciente.sexo,
      paciente.datNasc,
      paciente.rg,
      paciente.cep,
      paciente.estado,
      paciente.cidade,
      paciente.rua,
      paciente.num,
      paciente.bairro,
      paciente.complemento,
      paciente.email,
      paciente.tel1,
      paciente.tel2
    ];
    const result = await db.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao cadastrar paciente:', err);
    res.status(500).send('Erro ao cadastrar paciente');
  }
});

app.get('/api/pacientes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pacientes');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar pacientes:', err);
    res.status(500).send('Erro ao buscar pacientes');
  }
});

app.put('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  const paciente = req.body;
  try {
    const sql = `
      UPDATE pacientes
      SET nome = $1, cpf = $2, sexo = $3, "datNasc" = $4, rg = $5, cep = $6, estado = $7, cidade = $8, rua = $9, num = $10, bairro = $11, complemento = $12, email = $13, tel1 = $14, tel2 = $15
      WHERE id = $16 RETURNING *
    `;
    const values = [
      paciente.nome,
      paciente.cpf,
      paciente.sexo,
      paciente.datNasc,
      paciente.rg,
      paciente.cep,
      paciente.estado,
      paciente.cidade,
      paciente.rua,
      paciente.num,
      paciente.bairro,
      paciente.complemento,
      paciente.email,
      paciente.tel1,
      paciente.tel2,
      id
    ];
    const result = await db.query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar paciente:', err);
    res.status(500).send('Erro ao atualizar paciente');
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM pacientes WHERE id = $1', [id]);
    res.status(200).send('Paciente excluído com sucesso');
  } catch (err) {
    console.error('Erro ao excluir paciente:', err);
    res.status(500).send('Erro ao excluir paciente');
  }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
