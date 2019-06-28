const express = require('express');
const homePage = express.Router();
const cors = require("cors");
const Room = require('../models/Room');
const User = require('../models/User');
const sequelize = require('sequelize');
const Op = sequelize.Op
const numOfHighScoreUser = 5;

homePage.use(cors());

homePage.get('/rooms', (req, res)=>{
    //let headerInFo = req.headers; // if anything needs to transmit to backend
    Room.findAll({
        where: sequelize.where(sequelize.fn('array_length', sequelize.col('playerid'), 1), 3) // three players in a room is full 
    })
    .then(needToBeTrue=>{
        for(let i=0; i<needToBeTrue.length; ++i){
            needToBeTrue[i].update({active: true});
        }
    })
    .then(()=>{
        Room.findAll({
            where:{
                active: false
            }
        })
        .then(activeRoom=>{
            let roomArr =[];
            activeRoom.forEach(ele=>{
                roomArr.push({
                    primary_k: ele.id,
                    name: ele.name,
                    player_num: ele.playerid.length
                })
            })
            res.send(roomArr);
        })
        .catch(err=>{
            console.log(err)
        });
    })
    .catch(err=>{
        console.log(err);
    })
    
})

homePage.get('/highScore', (req, res)=>{
    User.findAll({
        where:{
            score:{[Op.gt]: 0}
        }
    })
    .then(highScoreUser=>{
        let userWillReturn = highScoreUser.sort((a,b)=>{
            return b.score - a.score; // largest one to smallest one
        })
        let usr = [];
        for(let i=0; i<userWillReturn.length; ++i){
            let name = (userWillReturn[i].first_name).concat(userWillReturn[i].last_name);
            usr.push({
                id: userWillReturn[i].id,
                name: name,
                score: userWillReturn[i].score
            })
        }
        console.log(usr);

        if(usr.length > numOfHighScoreUser){
            let lastHighScore = usr[numOfHighScoreUser-1].score;
            let user = usr.filter(element=>{
                return element.score >= lastHighScore
            })
            res.send(user);
        }else{
            res.send(usr);
        }
    })
    .catch(err=>{
        console.log(err);
    })
})

homePage.post('/rooms', (req, res)=>{
    let roomInFo ={
        name: req.body.roomName,
        active: false,
        playerid: []
    }
    Room.create(roomInFo)
    .then(newRoom=>{
        res.send({roomid: newRoom.id});
    })
    .catch(err=>{
        console.log(err); 
    }) 
})

homePage.post('/record', (req, res)=>{
    User.findOne({
        where:{
            id: req.headers.id
        }
    })
    .then(user=>{
        user.update({score: req.body.score});
    })
    .catch(err=>{
        console.log(err);
    })

    Room.findOne({
        where:{
            id: req.body.roomid
        }
    })
    .then(room=>{
        if(room != undefined){
            room.destroy({force: true});
        }
    })
    .catch(err=>{
        console.log(err);
    })
})

module.exports = homePage;