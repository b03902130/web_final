import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import openSocket from 'socket.io-client'
import {
    Typography,
    Box,
    Divider,
    Fab,
    Grid,
    Paper,
} from '@material-ui/core'
import './Room.css'

import { Animate } from "react-rebound"
import Camera from './Camera'
import Runner from './Runner'
import axios from 'axios'

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roominfo: null,
            players: [],
            timer: 3,
            players_x: {},
        }
        this.end = false
        this.socket = undefined
        this.userid = localStorage.getItem('id')
        this.endpoint = 500
    } 
    
    componentDidMount() {
        window.onbeforeunload = () => {
            console.log('onbeforeunload')
            // debugger
            this.leave()
        }

        // Handling socket
        this.socket = openSocket(window.env.backend)
        if (this.socket !== undefined) {
            this.socket.on('err', data => {
                console.log(data)
                this.props.history.push('/')
            })
            this.socket.on('resRoomInfo', data => {
                this.setState({roominfo: data})
            })
            this.socket.on('kickout', data => {
                alert('This room is not available currently')
                this.props.history.push('/')
            })
            this.socket.on('players', data => {
                this.setState({players: data})
            })
            this.socket.on('start', data => {
                let xs = {}
                this.state.players.forEach(player => {
                    xs[player.id] = 0
                })
                this.setState(state => ({roominfo: {...state.roominfo, active: true}, players_x: xs}))
                this.interval = window.setInterval(() => {this.countdown()}, 1000)
            })
            this.socket.on('update', data => {
                let playerid = parseInt(data.id)
                this.setState(state => {
                    let player = state.players.find(player => player.id === playerid)
                    let update
                    if (player) {
                        let old_x = state.players_x[player.id]
                        let new_x = data.step > old_x ? data.step : old_x
                        update = {
                            players_x: {
                                ...state.players_x,
                                [player.id]: new_x
                            }
                        }
                    } else {
                        update = {}
                    }
                    return update
                })
            })

            // enter the room
            this.reqRoomInfo()
            this.enter()            
        } else {
            alert('Can not connect to server via Socket.io')
        }
    }

    componentWillUnmount() {
        // leave the room
        let id = parseInt(this.userid)
        let ids = this.state.players.map(player => player.id)
        if (ids.includes(id)) {
            console.log('componentWillUnmount')
            // debugger
            this.leave()
        }
        window.onbeforeunload = null 
    }
    
    updateX = (diffPixels) => {
        let threshold = 10
        let endpoint = this.endpoint
        let pixel = Math.round(diffPixels / 1000)
        pixel = pixel <= threshold ? pixel : threshold
       
        let old_x = this.state.players_x[this.userid]
        if (diffPixels && !this.end) {
            this.step(old_x + pixel)
        } 
    };
    
    countdown = () => {
        this.setState(state => {
            let newTimer = state.timer - 1
            if (newTimer === 0) {
                window.clearInterval(this.interval)
                this.interval = window.setInterval(this.judger, 10)
                this.startTime = new Date().getTime()
            }
            return {timer: newTimer}
        })
    }
    
    judger = () => {
        let start = document.getElementsByClassName(`gif-start`)[0].getBoundingClientRect().x
        let movements = [...document.getElementsByClassName(`gif-now`)].map(obj => obj.getBoundingClientRect().x - start)
        movements.forEach((movement, index) => {
            if (movement >= this.endpoint) {
                if (!this.state.winner) {
                    this.setState({ winner: this.state.players[index].name })
                }
                if (!this.end && this.state.players[index].id == this.userid) {
                    this.end = true
                    let userid = this.userid 
                    let roomid = this.props.match.params.roomid
                    axios.post(window.env.backend + 'record', {roomid: roomid, score: new Date().getTime() - this.startTime}, {headers: {id: userid} })
                        .then(res => {
                            console.log('Update successes')
                        })
                        .catch(err => {
                            alert('Error when posting record')
                        })
                }
            }
        })
    }

    enter = () => {
        let userid = this.userid 
        let roomid = this.props.match.params.roomid
        if (userid === 'undefined' || roomid === undefined) {
            alert('Data not complete')
        } else {
            this.socket.emit('enter', {
                userid: userid, 
                roomid: roomid
            })
        }
    }
    
    reqRoomInfo = () => {
        let roomid = this.props.match.params.roomid
        if (roomid === undefined) {
            alert('Data not complete')
        } else {
            this.socket.emit('reqRoomInfo', {
                roomid: roomid
            })
        }
    }

    leave = () => {
        // debugger
        console.log('Leave')
        let userid = this.userid 
        let roomid = this.props.match.params.roomid
        if (userid === 'undefined' || roomid === undefined) {
            alert('Data not complete')
        } else {
            let tmp = this
            this.socket.emit('leave', {
                userid: userid,
                roomid: roomid
            })
        }
        window.clearInterval(this.interval)
    }
    
    start = () => {
        this.socket.emit('start', {roomid: this.props.match.params.roomid})
    }

    step = (amount) => { 
        if (this.state.timer === 0) {
            this.socket.emit('step', {
                roomid: this.props.match.params.roomid,
                userid: this.userid,
                step: amount
            })
        }
    }

    render() {
        return ( !this.state.roominfo ? 
            <h3>Loading</h3>
            :
            !this.state.roominfo.active ?
                <div>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="Add"
                        onClick={this.start}
                        style={{
                            margin: "20px auto",
                            display: "block"
                        }}
                    >
                        START    
                    </Fab>
                    <Typography component="div">
                        <Box className="title" textAlign="center" fontWeight="fontWeightLight" fontSize={22} fontFamily="Segoe UI">
                            Room Name
                        </Box>
                        <Box className="content" textAlign="center" fontWeight="fontWeightHeavy" fontSize={60} fontFamily="Segoe UI">
                            {this.state.roominfo.name}
                        </Box>
                        <Divider className="divider" />
                        <Box className="title" textAlign="center" fontWeight="fontWeightLight" fontSize={22} fontFamily="Segoe UI">
                            Players
                        </Box>
                        {
                            this.state.players.map(player => (
                                <Box className="content" textAlign="center" fontWeight="fontWeightHeavy" fontSize={36} fontFamily="Segoe UI">
                                    {player.name}
                                </Box>
                            ))
                        }
                    </Typography>
                </div>
                :
                <div>
                    <Grid container spacing={3}>
                        {
                            this.state.timer !== 0 ?
                                <Grid item xs={8} style={{marginTop: "50px"}}>
                                {
                                    <Typography component="div">
                                        <Box textAlign="center" fontWeight="fontWeightBold" fontSize={48} fontFamily="Segoe UI">
                                            ARE YOU READY
                                        </Box>
                                        <Box textAlign="center" fontWeight="fontWeightBold" fontSize={200} fontFamily="Segoe UI">
                                            {this.state.timer}
                                        </Box>
                                    </Typography>
                                }
                                </Grid>
                                :
                                <Grid item xs={8}>
                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                    {
                                        this.state.players.map(player => (
                                            <Grid item style={{marginTop: "30px"}}>
                                                <h3><strong>{player.name}</strong></h3>
                                                <Runner x={this.state.players_x[player.id]} playerid={player.id} />
                                            </Grid>        
                                        ))
                                    }
                                    </Grid>
                                </Grid>
                        }
                        <Grid item xs={4} style={{marginTop: "30px"}}>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="center"
                                spacing={2}
                            >
                                {
                                    this.state.winner && 
                                    <Grid item>
                                        <Paper>
                                            <Typography component="div">
                                                <Box style={{width: "350px"}} textAlign="center" fontWeight="fontWeightLight" fontSize={22} fontFamily="Segoe UI">
                                                    WINNER
                                                </Box>
                                                <Box style={{width: "350px"}} textAlign="center" fontWeight="fontWeightBold" fontSize={40} fontFamily="Segoe UI">
                                                    {this.state.winner}
                                                </Box>
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                }        
                                <Grid item>
                                    <Camera updateX={this.updateX} />        
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
        )
    }
} 
        
export default withRouter(Room)


