const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carregar variáveis do .env
dotenv.config();

const app = express();
const port = 5432;

// Configuração da conexão com o banco
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432
});

// Conexão com o banco
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err);
    }
    console.log('Conectado ao banco de dados PostgreSQL.');
    release();
});

// Exemplo para utilizar nas rotas (não apagar ainda)
/*app.get('/api/pacientes', (req, res) => {
    pool.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            res.status(500).send('Erro ao buscar pacientes');
        } else {
            res.json(results.rows); // PostgreSQL retorna resultados em rows
        }
    });
});*/

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
