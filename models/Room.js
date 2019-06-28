const db = require('../database/database');
const Sequelize = require("sequelize");

module.exports = db.sequelize.define('rooms',
    {  
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: Sequelize.TEXT  
        },
        active:{
            type: Sequelize.BOOLEAN
        },
        playerid:{
            type: Sequelize.ARRAY(Sequelize.DECIMAL)
        }
    },
    {
        timestamps: false
    }
)