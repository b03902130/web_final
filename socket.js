const ioLib = require('socket.io');
// const app = require('./server');
const Room = require('./models/Room')
const User = require('./models/User')
const sequelize = require('sequelize');
const Op = sequelize.Op


module.exports = (server) => {
    io = ioLib(server);
    // app.set('socketio', io);
    io.on('connection', socket => {
        socket.on('reqRoomInfo', data=>{
            Room.findOne({
                where:{
                    id: data.roomid
                }
            })
            .then(room=>{
                if(room != undefined){
                    let roomInFo={
                        name: room.name,
                        active: room.active
                    }
                    socket.emit('resRoomInfo', roomInFo);
                }
                else{
                    socket.emit('err', "room doesnt exist!");
                }
            })
            .catch(err=>{
                console.log(err);
            })
        })
        socket.on('enter', data => {
            socket.join(`${data.roomid}`, () => {
                let usr = [];
                let room = Object.keys(socket.rooms);
                console.log(room);
                Room.findOne({
                    where: {
                        id: data.roomid
                    }
                })
                    .then(room => {
                        if(room != undefined){
                            let specific_usr = (room.playerid).filter(ele=>{
                                return ele == data.userid
                            })
                            let UserNotInRoom = (!specific_usr.length)?true:false;
                            if(room.active == false && UserNotInRoom){
                                (room.playerid).push(data.userid);
                                room.update({playerid: room.playerid});
                                console.log("room.playerid "+room.playerid);
                                User.findAll({
                                    where: {
                                        id: {
                                            [Op.or]: [...room.playerid]
                                        }
                                    }
                                })
                                    .then(user => {
                                        console.log("match user "+user);
                                        for(let i=0; i<user.length; ++i){
                                            let name = (user[i].first_name).concat(user[i].last_name)
                                            usr.push({
                                                id: user[i].id,
                                                name: name
                                            })
                                        }
                                    })
                                    .then(()=>{
                                        console.log(usr);
                                        io.to(`${data.roomid}`).emit('players', usr);
                                    })   
                            }else{
                                socket.emit('kickout');
                            }
                        }else{
                            socket.emit('err', "fail to use socket to enter the room!");
                        }
                        
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            })
        })
        socket.on('leave', data => {
            socket.leave(`${data.roomid}`, () => {
                let user = [];
                let usr = [];
                let room = Object.keys(socket.rooms);
                console.log(room);
                Room.findOne({
                    where: {
                        id: data.roomid
                    }
                })
                    .then(room => {
                        user = room.playerid;
                        let needToDelete = user.filter(ele => {
                            return ele === data.userid
                        })
                        user.splice(user.indexOf(needToDelete[0]), 1);
                        room.update({playerid: user});
                        // console.log(user);
                    })
                    .then(() => {
                        User.findAll({
                            where: {
                                id: {
                                    [Op.or]: [...user]
                                }
                            }
                        })
                            .then(user => {
                                for(let i=0; i<user.length; ++i){
                                    let name = (user[i].first_name).concat(user[i].last_name)
                                    usr.push({
                                        id: user[i].id,
                                        name: name
                                    })
                                }

                            })
                            .then(()=>{
                                console.log(usr);
                                io.to(`${data.roomid}`).emit('players', usr); // specific player leave the room 
                                                                              // and need to let the rest of players in the room update the condi of the room
                            })
                            .then(()=>{
                                if(user.length === 0){
                                    // room.destroy({force: true});
                                    Room.findOne({
                                        where:{
                                            id: data.roomid
                                        }
                                    })
                                    .then(room=>{
                                        room.destroy({force: true});
                                    })
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            })
        })
        socket.on('step', data=>{
            let broadCastToPlayer = {
                id: data.userid,
                step: data.step
            }
            socket.to(`${data.roomid}`).emit('update', broadCastToPlayer); // except sender
            // io.to(`${data.roomid}`).emit('update', broadCastToPlayer); // include sender
        })
        socket.on('start', data=>{
            Room.findOne({
                where:{
                    id: data.roomid
                }
            })
            .then(room=>{
                room.update({active: true});
                console.log("room.id = "+room.id);
                console.log("inactive the room");
            })
            .then(()=>{
                io.in(`${data.roomid}`).emit('start');
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
}