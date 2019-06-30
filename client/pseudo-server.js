const express = require('express')
const cors = require('cors')
const jwt = require('jwt-simple')
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const {db} = require('./pseudo-database.js')

var counter = 100

// Create server to serve index.html
const app = express()
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('build'))
app.post('/users/register', (req, res) => {
    let newUser = req.body
    let data = {
        primary_k: counter,
        name: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
    }
    counter += 1
    db.Users.push(data)
    res.status(200).send()
})
app.post('/users/login', (req, res) => {
    let user = db.Users.filter(user => (user.email === req.body.email))[0]
    let token = jwt.encode({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email 
    }, 'secret')
    res.status(200).send({
        token: token,
        primary_k: user.primary_k
    })
})
app.get('/rooms', (req, res) => { 
    let rooms = db.Rooms.map(room => ({primary_k: room.primary_k, name: room.name, player_num: room.playerID.length, active: room.active})) 
    rooms = rooms.filter(room => !room.active)
    res.status(200).send(rooms) 
})
app.get('/highScore', (req, res) => { 
    db.Users.sort((a, b) => a.score - b.score)
    let highest = db.Users.slice(0, 5).map(user => ({
        id: user.primary_k,
        name: user.name,
        score: user.score
    }))
    res.status(200).send(highest)
})
app.post('/rooms', (req, res) => {
    let primary_k = counter
    db.Rooms.push({primary_k: counter, active: false, playerID: [], name: req.body.roomName})
    counter += 1
    let rooms = getRooms()  
    req.app.io.in('home').emit('update_rooms', rooms)
    res.status(200).send({roomid: primary_k}) 
})
app.post('/record', (req, res) => {
    let userid = req.headers.id
    let roomid = req.body.roomid
    let score = req.body.score
    let user = db.Users.find(user => user.primary_k === parseInt(userid))
    if (score < user.score) {
        user.score = score
    }
    res.status(200).send() 
})
app.use('*', (req, res) => {
    res.status(200).sendFile(__dirname + '/build/index.html')
})

const http = require('http').Server(app)
const port = process.env.PORT || 5000
const serverSocket = require('socket.io')(http)
app.io = serverSocket

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
})

function getRooms() {
    let rooms = db.Rooms.map(room => ({primary_k: room.primary_k, name: room.name, player_num: room.playerID.length, active: room.active})) 
    rooms = rooms.filter(room => !room.active)
    return rooms
}

// Connect to mongo
serverSocket.on('connection', socket => {
    // First time running
    socket.on('enter', data => {
        let room = db.Rooms.find(room => room.primary_k === parseInt(data.roomid))
        if (room === undefined) {
            socket.emit('err', '[enter] Room not exists')
            return
        }
        if (room.active || room.playerID.includes(parseInt(data.userid))) {
            socket.emit('kickout')
            return
        }
        socket.join(data.roomid, () => {
            room.playerID.push(parseInt(data.userid))
            serverSocket.in(data.roomid).emit('players', room.playerID.map(id => ({id: id, name: `name-${id}`})))
            serverSocket.in('home').emit('update_rooms', getRooms())
        })
    })

    socket.on('enter_home', data => {
        socket.join('home')
    })
    socket.on('leave_home', data => {
        socket.leave('home')
    })

    socket.on('reqRoomInfo', data => {
        let room = db.Rooms.find(room => room.primary_k === parseInt(data.roomid))
        if (room === undefined) {
            socket.emit('err', '[reqRoomInfo] Room not exists')
        } else {
            socket.emit('resRoomInfo', {
                name: room.name
            })
        }
    })

    socket.on('leave', data => {
        let index = db.Rooms.findIndex(room => (room.primary_k === parseInt(data.roomid)))
        if (index !== -1) {
            let room = db.Rooms[index]
            if (room.playerID.length > 1) {
                room.playerID = room.playerID.filter(id => (id !== parseInt(data.userid)))
                socket.leave(data.roomid, () => {
                    serverSocket.to(data.roomid).emit('players', room.playerID.map(id => ({id: id, name: `name-${id}`})))
                }) 
            } else if (room.playerID.length === 0) {
                db.Rooms = db.Rooms.filter((room, i) => (i !== index))
            } else if (room.playerID[0] === parseInt(data.userid)) {
                db.Rooms = db.Rooms.filter((room, i) => (i !== index))
            }
            serverSocket.in('home').emit('update_rooms', getRooms())
        } else {
            socket.emit('err', '[leave] Room not exists')
        }
    })

    socket.on('start', data => {
        let room = db.Rooms.find(room => room.primary_k === parseInt(data.roomid))
        room.active = true
        serverSocket.to(data.roomid).emit('start')
    })

    socket.on('step', data => {
        serverSocket.to(data.roomid).emit('update', {
            id: data.userid,
            step: data.step 
        })
    })
})

