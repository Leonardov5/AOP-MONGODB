const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const conexao = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Conectado: ${conexao.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;