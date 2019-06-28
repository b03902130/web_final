const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000
const http = require('http');
const io = require('./socket');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

const Users = require('./routes/Users')
const HomePage = require('./routes/HomePage')

app.use('/users', Users);
app.use('/', HomePage);


// app.listen(port, ()=>{
//     console.log("Server is running on port: " + port);
// })
app.set('port', port);

let server = http.createServer(app);
server.listen(port);
console.log("Server is running on port: " + port);

io(server);

