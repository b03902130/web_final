const Sequelize = require("sequelize")
const db = require("../database/database")

module.exports = db.sequelize.define('users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
<<<<<<< HEAD
        ,
        score:{
            type: Sequelize.INTEGER
        }
=======
>>>>>>> 55be44ba7dec181f14fdcfbfbb0d2fbd02ea1ef7
    },
    {
        timestamps: false
    }
)