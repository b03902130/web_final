const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // slower than the one in C++, this is the pure Javascript version

const User = require("../models/User");
users.use(cors());

process.env.SECRET_KEY = 'secret';// set env variable my own for jwt to use

users.post('/register', (req, res) => {
    const today = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    User.findOne({// model will return a Promise, based on the official Sequelize website
        // here is the link: http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-findOne
        where: {
            email: req.body.email
        }
    })
        .then(user => { // avoid "rainbow table attacks"
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash // based on hash + salt encryption, the actual data stored in database is the hash
                    User.create(userData)
                        .then(user => {
                            res.json({ status: user.email + ' registered!' });
                        })
                        .catch(err => {
                            res.send('error: ' + err);
                        })
                })
            } else {
                res.json({ error: "User already exists", user: user })
            }
        })
        .catch(err => {
            res.send('err' + err);
        })
})


users.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {// compare the incoming password with the hash already in the database
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {// need to use "user.dataValues"(object) instead of "user"(promise)
                        expiresIn: 1440
                    })
                    // res.send({token: token, user: user.dataValues});
                    res.send({
                        'token': token,
                        'primary_k': user.id
                    });
                    // res.send(token);
                }else{
                    res.status(400).json({ error: 'password wrong' });
                }
            } else {
                res.status(400).json({ error: 'User does not exist!' });
            }
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })
})

module.exports = users