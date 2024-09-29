// const { Sequelize } = require('sequelize');
import path from 'path';
import { Sequelize } from 'sequelize-typescript';


const sequelize = new Sequelize({
   database: process.env.DB_NAME || 'kanban',
   username: process.env.DB_USER || 'root',
   password: process.env.DB_PASS || 'password',
   host: process.env.DB_HOST || 'localhost',
   dialect: 'mysql',
   models: [path.resolve(__dirname, 'models')]
});

sequelize.authenticate()
    .then(() => console.log('MySQL Connected'))
    .catch(err => console.error('Connection error: ', err));

    
module.exports = sequelize;
