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
  try {
    const result = await db.query('SELECT * FROM consultas WHERE data = $1', [data]);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar consultas:', err);
    res.status(500).send('Erro ao buscar consultas');
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


// Endpoint para buscar movimentações
app.get('/api/financeiro', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM financeiro'); 
    const movimentacoes = result.rows.map(moviment => {
      return {
        ...moviment,
        item: moviment.referencia === 'Clínica' ? moviment.item : 'Procedimento', // Mantenha o item para clínica
        qtd: moviment.qtd, // A quantidade que foi movimentada
        categoria: moviment.categoria, // Inclua a categoria
        datamoviment: moviment.datamoviment // Inclua a data da movimentação
      };
    });
    res.json(movimentacoes);
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).send('Erro ao buscar movimentações');
  }
});



// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
