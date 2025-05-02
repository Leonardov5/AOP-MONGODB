const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');
const path = require('path');

dotenv.config();

conectarDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/filmes', require('./routes/filmesRoutes'));

app.get('/', (req, res) => {
  res.send('API de Filmes funcionando!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});