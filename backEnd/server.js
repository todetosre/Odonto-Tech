const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para hash de senhas (opcional, mas recomendado)
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT (opcional, mas recomendado)
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

//Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE usuario = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    // Comparar senha usando bcrypt
    const isValidPassword = await bcrypt.compare(password, user.senha);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar o nome do usuário na resposta
    res.json({ message: 'Login bem-sucedido', token, nome: user.nome });
  } catch (err) {
    console.error('Erro ao autenticar usuário:', err);
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
});

app.get('/api/consultas/procedimentos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM consultas');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar consultas:', err);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});

//Estoque
// Endpoint para adicionar um novo produto
app.post('/api/estoque', async (req, res) => {
  const { cod, produto, categoria, qtd, datvalidade } = req.body;

  const sql = `
    INSERT INTO estoque (cod, produto, categoria, qtd, datvalidade)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [cod, produto, categoria, qtd, datvalidade];

  try {
    await db.query(sql, values);
    res.status(201).send('Produto adicionado com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).send('Erro ao adicionar produto');
  }
});

// Endpoint para buscar produtos no estoque
app.get('/api/estoque', async (req, res) => {
  const { search } = req.query; // Pega o parâmetro de busca da query string

  try {
    let query = 'SELECT * FROM estoque';
    let values = [];

    // Se houver um termo de busca, adiciona a cláusula WHERE
    if (search) {
      query += ' WHERE produto ILIKE $1 OR categoria ILIKE $1';
      values.push(`%${search}%`);
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Endpoint para atualizar um produto no estoque
app.put('/api/estoque/:cod', async (req, res) => {
  const { cod } = req.params;
  const { produto, categoria, qtd, datvalidade } = req.body;

  const sql = `
    UPDATE estoque
    SET produto = $1, categoria = $2, qtd = $3, datvalidade = $4
    WHERE cod = $5
    RETURNING *
  `;
  const values = [produto, categoria, qtd, datvalidade, cod];

  try {
    const result = await db.query(sql, values);
    if (result.rowCount === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.status(200).json({ message: 'Produto atualizado com sucesso', produto: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).send('Erro ao atualizar produto');
  }
});


// Endpoint para buscar o histórico de procedimentos de um paciente específico usando o ID do paciente
app.get('/api/consultas/paciente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Obter o nome do paciente pelo ID
    const pacienteResult = await db.query('SELECT nome FROM pacientes WHERE id = $1', [id]);

    if (pacienteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    const nomePaciente = pacienteResult.rows[0].nome;

    // Buscar consultas usando o nome do paciente
    const consultasResult = await db.query(`
      SELECT id, data, horario, procedimento, dentista 
      FROM consultas 
      WHERE paciente = $1
    `, [nomePaciente]);

    if (consultasResult.rows.length > 0) {
      res.json(consultasResult.rows);
    } else {
      res.status(404).json({ message: 'Nenhum procedimento encontrado para este paciente.' });
    }
  } catch (err) {
    console.error('Erro ao buscar histórico de procedimentos do paciente:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico de procedimentos.' });
  }
});

// Endpoint para remover um produto do estoque
app.delete('/api/estoque/:cod', async (req, res) => {
  const { cod } = req.params;
  try {
    const result = await db.query('DELETE FROM estoque WHERE cod = $1', [cod]);
    if (result.rowCount === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.status(200).send('Produto removido com sucesso');
  } catch (err) {
    console.error('Erro ao remover o produto:', err);
    res.status(500).send('Erro ao remover o produto');
  }
});

// Endpoint para buscar produtos com baixo estoque
app.get('/api/estoque/baixo-estoque', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM estoque WHERE qtd::INTEGER < 25;'); // Exemplo de limite de quantidade
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos com baixo estoque:', err);
    res.status(500).send('Erro ao buscar produtos com baixo estoque');
  }
});

//Endpoint para filtrar produtos pela data de validade
app.get('/api/estoque/validade', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM estoque WHERE datvalidade < NOW() + INTERVAL \'30 days\'');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos por validade:', err);
    res.status(500).send('Erro ao buscar produtos por validade');
  }
});


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

// Exemplo de endpoint para busca de pacientes por nome
app.get('/api/pacientes/buscar/:nome', async (req, res) => {
  const { nome } = req.params;

  try {
    // Busca pacientes cujo nome contém o termo de pesquisa
    const result = await db.query(
      `SELECT id, nome FROM pacientes WHERE nome ILIKE $1`,
      [`%${nome}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar pacientes:', err);
    res.status(500).json({ error: 'Erro ao buscar pacientes.' });
  }
});


//Consulta
// Endpoint para buscar todos os dentistas
app.get('/api/dentistas', async (req, res) => {
  try {
    const result = await db.query("SELECT nome FROM funcionarios WHERE funcao = 'Dentista'");
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar dentistas:', err);
    res.status(500).send('Erro ao buscar dentistas');
  }
});

// Endpoint para agendar uma nova consulta
app.post('/api/consultas', async (req, res) => {
  const { paciente, data, horario, procedimento, dentista } = req.body; // Dados recebidos do front-end

  const sql = `
    INSERT INTO consultas (paciente, data, horario, procedimento, dentista)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `;

  const values = [paciente, data, horario, procedimento, dentista];

  try {
    const result = await db.query(sql, values);
    res.status(201).json({ message: 'Consulta agendada com sucesso!', consulta: result.rows[0] });
  } catch (err) {
    console.error('Erro ao agendar consulta:', err);
    res.status(500).send('Erro ao agendar consulta');
  }
});

// Endpoint para buscar todas as consultas
app.get('/api/consultas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM consultas');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar consultas:', err);
    res.status(500).send('Erro ao buscar consultas');
  }
});

// Endpoint para buscar consultas por data
app.get('/api/consultas/:data', async (req, res) => {
  const { data } = req.params;
  
  // Verifica se o parâmetro é uma data válida
  if (isNaN(Date.parse(data))) {
    return res.status(400).json({ error: 'Data inválida' });
  }

  try {
    const result = await db.query('SELECT * FROM consultas WHERE data = $1', [data]);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar consultas:', err);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});


// Odontogrma
// Endpoint para buscar o odontograma de um paciente
app.get('/api/odontogramas/:pacienteId', async (req, res) => {
  const pacienteId = req.params.pacienteId;
  try {
      const result = await db.query('SELECT * FROM odontogramas WHERE paciente_id = $1', [pacienteId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Erro ao buscar odontograma:', error);
      res.status(500).send('Erro ao buscar odontograma');
  }
});

// Endpoint para salvar ou atualizar o odontograma
app.post('/api/odontogramas', async (req, res) => {
  const { paciente_id, dente_id, procedimento } = req.body;
  try {
      const existing = await db.query('SELECT * FROM odontogramas WHERE paciente_id = $1 AND dente_id = $2', [paciente_id, dente_id]);

      if (existing.rows.length > 0) {
          // Atualizar
          await db.query('UPDATE odontogramas SET procedimento = $1 WHERE paciente_id = $2 AND dente_id = $3', [procedimento, paciente_id, dente_id]);
      } else {
          // Inserir
          await db.query('INSERT INTO odontogramas (paciente_id, dente_id, procedimento) VALUES ($1, $2, $3)', [paciente_id, dente_id, procedimento]);
      }
      res.sendStatus(204);
  } catch (error) {
      console.error('Erro ao salvar odontograma:', error);
      res.status(500).send('Erro ao salvar odontograma');
  }
});


//Financeiro
// Endpoint para adicionar uma nova movimentação financeira
app.post('/api/financeiro', async (req, res) => {
  const { tipomoviment, referencia, valor, datamoviment, entrada, saida, caixa, procedimento, item, qtd, usuario } = req.body;

  // Validação dos dados recebidos
  if (!tipomoviment || !referencia || valor === undefined || !datamoviment || !usuario) {
    return res.status(400).send('Campos obrigatórios: tipomoviment, referencia, valor, datamoviment e usuario.');
  }

  // Verificação do formato da data
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(datamoviment)) {
    return res.status(400).send('O formato da data deve ser YYYY-MM-DD.');
  }

  const sql = `
    INSERT INTO financeiro ("tipomoviment", referencia, valor, "datamoviment", entrada, saida, caixa, procedimento, item, qtd, usuario)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;
  const values = [tipomoviment, referencia, valor, datamoviment, entrada, saida, caixa, procedimento, item, qtd, usuario];

  try {
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar movimentação financeira:', err);
    res.status(500).send('Erro ao adicionar movimentação financeira');
  }
});

// Endpoint para marcar presença para o paciente
app.put('/api/consultas/atualizar-presenca', async (req, res) => {
  const { paciente, data } = req.body;

  if (!paciente || !data) {
    return res.status(400).json({ error: 'Paciente e data são obrigatórios' });
  }

  try {
    const query = `
      UPDATE consultas
      SET presenca = 'Atendido'
      WHERE paciente = $1 AND data = $2
    `;

    const values = [paciente, data];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Presença atualizada para Atendido' });
  } catch (error) {
    console.error('Erro ao atualizar presença:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});




// Endpoint para buscar pacientes com agendamentos futuros
app.get('/api/pacientes/agendados', async (req, res) => {
  const { data } = req.query;
  if (!data) {
    return res.status(400).json({ error: 'Data é obrigatória' });
  }

  try {
    const query = `
      SELECT DISTINCT c.paciente
      FROM consultas c
      WHERE c.data >= $1
    `;
    const { rows } = await db.query(query, [data]);

    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error.message);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});



// Endpoint para buscar movimentações com ordenação e filtros
app.get('/api/financeiro', async (req, res) => {
  const { tipo, usuario } = req.query;

  let query = 'SELECT * FROM financeiro WHERE 1=1';
  let queryParams = [];

  if (tipo) {
    query += ' AND tipomoviment = $1';
    queryParams.push(tipo);
  }

  if (usuario) {
    query += ' AND usuario = $2';
    queryParams.push(usuario);
  }

  query += ' ORDER BY datamoviment ASC, id ASC';

  try {
    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).send('Erro ao buscar movimentações');
  }
});


//endpoint para listar usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users'); // Exemplo para SQL
    res.json(users.rows); // Ajuste conforme sua consulta e banco
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

//endpoint para editar
app.put('/api/financeiro/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { tipomoviment, referencia, valor, datamoviment, procedimento, item, qtd, usuario } = req.body;

  console.log('Atualizando movimentação com ID:', id); // Log para verificar o ID

  try {
    const result = await db.query(
      `UPDATE financeiro
       SET tipomoviment = $1, referencia = $2, valor = $3, datamoviment = $4,
           procedimento = $5, item = $6, qtd = $7, usuario = $8
       WHERE id = $9`,
      [tipomoviment, referencia, valor, datamoviment, procedimento, item, qtd, usuario, id]
    );

    if (result.rowCount === 0) {
      console.log('Movimentação não encontrada');
      return res.status(404).send('Movimentação não encontrada');
    }

    res.send('Movimentação atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error); // Log para capturar o erro
    res.status(500).send('Erro ao atualizar a movimentação');
  }
});

//Endpoint para deletar
app.delete('/api/financeiro/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  console.log('Deletando movimentação com ID:', id); // Log para verificar o ID

  try {
    const result = await db.query('DELETE FROM financeiro WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      console.log('Movimentação não encontrada');
      return res.status(404).send('Movimentação não encontrada');
    }

    res.send('Movimentação excluída com sucesso');
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error); // Log para capturar o erro
    res.status(500).send('Erro ao excluir a movimentação');
  }
});

// Endpoint para obter o saldo atual do caixa
app.get('/api/financeiro/caixa', async (req, res) => {
  try {
    // Soma todas as entradas
    const entradaResult = await db.query('SELECT SUM(valor) FROM financeiro WHERE tipomoviment = \'Entrada\'');
    const entradas = entradaResult.rows[0].sum || 0;

    // Soma todas as saídas
    const saidaResult = await db.query('SELECT SUM(valor) FROM financeiro WHERE tipomoviment = \'Saída\'');
    const saidas = saidaResult.rows[0].sum || 0;

    // Calcula o saldo do caixa (entradas - saídas)
    const saldoCaixa = entradas - saidas;

    // Retorna o saldo como resposta
    res.json({ saldo: saldoCaixa });
  } catch (error) {
    console.error('Erro ao calcular o saldo do caixa:', error);
    res.status(500).send('Erro ao calcular o saldo do caixa');
  }
});

// Endpoint para calcular o saldo do caixa
app.get('/api/financeiro/saldo', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COALESCE(SUM(entrada), 0) - COALESCE(SUM(saida), 0) AS saldo 
      FROM financeiro
    `);

    const saldo = result.rows[0].saldo || 0;
    res.json({ saldo });
  } catch (error) {
    console.error('Erro ao calcular saldo do caixa:', error);
    res.status(500).send('Erro ao calcular saldo do caixa');
  }
});

// Endpoint para buscar a última entrada
app.get('/api/financeiro/ultima-entrada', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT valor 
      FROM financeiro 
      WHERE tipomoviment = 'Entrada' 
      ORDER BY datamoviment DESC, id DESC 
      LIMIT 1
    `);

    const ultimaEntrada = result.rows[0]?.valor || 0;
    res.json({ valor: ultimaEntrada });
  } catch (error) {
    console.error('Erro ao buscar última entrada:', error);
    res.status(500).send('Erro ao buscar última entrada');
  }
});

// Endpoint para buscar a última saída
app.get('/api/financeiro/ultima-saida', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT valor 
      FROM financeiro 
      WHERE tipomoviment = 'Saída' 
      ORDER BY datamoviment DESC, id DESC 
      LIMIT 1
    `);

    const ultimaSaida = result.rows[0]?.valor || 0;
    res.json({ valor: ultimaSaida });
  } catch (error) {
    console.error('Erro ao buscar última saída:', error);
    res.status(500).send('Erro ao buscar última saída');
  }
});

// Endpoint para buscar todos os dados da tabela financeiro
app.get('/api/relatorio-financeiro', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM financeiro');
    res.json(result.rows); // Retorna todas as linhas da tabela
  } catch (err) {
    console.error('Erro ao buscar dados financeiros:', err);
    res.status(500).send('Erro ao buscar dados financeiros');
  }
});

// Endpoint para buscar o procedimento de um paciente
app.get('/api/procedimentos/paciente', async (req, res) => {
  const { paciente } = req.query;

  try {
    // Consulta ao banco de dados para buscar o procedimento agendado para o paciente
    const result = await db.query(
      `SELECT procedimento FROM consultas WHERE paciente = $1 AND presenca != 'Atendido' ORDER BY data LIMIT 1`,
      [paciente]
    );

    if (result.rows.length > 0) {
      res.json({ procedimento: result.rows[0].procedimento });
    } else {
      res.status(404).json({ message: 'Nenhum procedimento encontrado para este paciente.' });
    }
  } catch (error) {
    console.error('Erro ao buscar procedimento do paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar procedimento do paciente' });
  }
});



//Home
// Endpoint para obter agendamentos do dia atual
app.get('/api/appointments', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para evitar problemas de fuso horário
    const todayString = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

    const query = `
      SELECT id, paciente, data, horario, procedimento, presenca
      FROM consultas
      WHERE data = $1
      ORDER BY horario ASC
    `;

    const values = [todayString];

    const result = await db.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    res.status(500).json({ error: 'Erro ao obter agendamentos' });
  }
});

// Endpoint para atualizar a presença de um appointment específico
app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { presenca } = req.body;

  // Validação dos dados recebidos
  if (!presenca || !['Sim', 'Não'].includes(presenca)) {
    return res.status(400).json({ error: 'Presença deve ser "Sim" ou "Não".' });
  }

  try {
    const query = `
      UPDATE consultas
      SET presenca = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [presenca, id];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    res.json({ message: 'Presença atualizada com sucesso.', appointment: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar presença:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
  }
});

// Endpoint para contar o número de pacientes atendidos
app.get('/api/consultas/atendimentos/atendidos', async (req, res) => {
  try {
    const query = `SELECT COUNT(*) FROM consultas WHERE presenca = 'Atendido'`;
    const result = await db.query(query);
    const totalAtendidos = parseInt(result.rows[0].count, 10);
    res.json({ totalAtendidos });
  } catch (error) {
    console.error('Erro ao buscar total de atendidos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar total de atendidos.', details: error.message });
  }
});



//Clinica
// Endpoint para dados dos gráficos
app.get('/api/dados-graficos', async (req, res) => {
  try {
    // Query para contar as ocorrências de cada procedimento
    const procedimentos = await db.query(`
      SELECT procedimento, COUNT(*) AS total
      FROM consultas
      WHERE procedimento IN ('Limpeza Dental', 'Tratamento de Cárie', 'Canal Radicular', 'Extração de Dente', 
                            'Clareamento Dental', 'Implante Dentário', 'Aparelho Ortodôntico', 'Aplicação de Flúor', 
                            'Prótese Dentária', 'Consulta Preventiva')
      GROUP BY procedimento
    `);

    // Query para contar as ocorrências de cada dentista
    const dentistas = await db.query(`
      SELECT dentista, COUNT(*) AS total
      FROM consultas
      GROUP BY dentista
    `);

    res.json({
      procedimentos: procedimentos.rows,
      dentistas: dentistas.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados dos gráficos' });
  }
});



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
