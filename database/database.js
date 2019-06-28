const Sequelize = require('sequelize');
const db = {}
// the one can link to the remote database on Heroku
//const sequelize = new Sequelize('<the link from heroku addons - psql database>');


// for local database testing, need to download PostgreSQL server locally to do that.
const sequelize = new Sequelize("ryanhu", "ryanhu", null, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false, // string based operator v.s symbol based operator
                             // for security use, not sure what kind of input the user will input

    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



