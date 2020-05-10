const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Categoria = require('./../models/categoriaModel');
const Estado = require('./../models/estadoModel');
const Pacote = require('./../models/pacoteModel');
const Perfil = require('./../models/perfilModel');
const Servico = require('./../models/servicoModel');
const User = require('./../models/userModel');
const SubCategoria = require('./../models/subCategoriaModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE_REMOTE
//             .replace('<PASSWORD>',  process.env.DATABASE_PWD)
//             .replace('<DBUSR>',     process.env.DATABASE_USR)
//             .replace('<HOST>',      process.env.DATABASE_HOST)
//             .replace('<DBNAME>',    process.env.DATABASE_NAME);

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const categorias = JSON.parse(
  fs.readFileSync(`${__dirname}/categorias.json`, 'utf-8')
);
const subSategorias = JSON.parse(
  fs.readFileSync(`${__dirname}/subCategorias.json`, 'utf-8')
);
const estados = JSON.parse(
  fs.readFileSync(`${__dirname}/estados.json`, 'utf-8')
);
const pacotes = JSON.parse(
  fs.readFileSync(`${__dirname}/pacotes.json`, 'utf-8')
);
const perfis = JSON.parse(
  fs.readFileSync(`${__dirname}/perfils.json`, 'utf-8')
);
const servicos = JSON.parse(
  fs.readFileSync(`${__dirname}/servicos.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    const categoriasResult = await Categoria.create(categorias);
    await SubCategoria.create(subSategorias);
    await Estado.create(estados);
    const pacoteResults = await Pacote.create(pacotes);
    await Perfil.create(perfis);
    await User.create(users, { validateBeforeSave: false });

    const usersResult = await User.findOne(
      { 'role.perfilCode': 1 },
      { _id: 1 }
    );

    servicos.forEach(el => {
      el.categoria = categoriasResult[0]._id;
      el.pacote = pacoteResults[0]._id;
      el.fornecedor = usersResult._id;
    });
    await Servico.create(servicos);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Categoria.deleteMany();
    await SubCategoria.deleteMany();
    await Estado.deleteMany();
    await Pacote.deleteMany();
    await Perfil.deleteMany();
    await Servico.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
