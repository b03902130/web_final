import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import axios from 'axios'
import openSocket from 'socket.io-client'
import {
    Grid,
    Fab,
    Typography,
    Box,
    Divider
} from '@material-ui/core'
import RoomCard from './RoomCard'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: [],
            leaders: []
        }
    }

    componentDidMount() {
        this.socket = openSocket(window.env.backend)
        this.socket.emit('enter_home')
        this.socket.on('update_rooms', data => {
            this.setState({rooms: data})
        })
        axios.get(window.env.backend + 'rooms')
            .then(res => {
                this.setState({rooms: res.data})
            })
            .catch(err => {
                alert('Error in getting rooms info')
                debugger
            })
        axios.get(window.env.backend + 'highScore')
            .then(res => {
                this.setState({leaders: res.data})
            })
            .catch(err => {
                alert('Error in getting highest scores')
                debugger
            })
    }
    componentWillUnmount() {
        this.socket.emit('leave_home')    
    }

    newRoom = () => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        let roomName = window.prompt('New room name: ', n)
        if (roomName) {
            axios.post(window.env.backend + 'rooms', {roomName: roomName}, {headers: {id: localStorage.getItem('id')} })
                .then(res => {
                    this.props.history.push(`/rooms/${res.data.roomid}`)
                })
                .catch(err => {
                    alert('Error in Home.js')
                })
        }
    }

    render() {
        return (
            <div style={{paddingTop: "20px"}}>
                <Box textAlign="center" fontWeight="fontWeightBold" fontSize={36} fontFamily="Segoe UI">
                    Leaderboard
                </Box>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{
                        margin: "5px auto",
                        padding: "0 100px"
                    }}
                >
                {
                    this.state.leaders.map(leader => (
                        <Grid item style={{margin: "10px 15px"}}>
                            <Typography component="div">
                                <Box textAlign="center" fontWeight="fontWeightRegular" fontSize={22} fontFamily="Segoe UI">
                                    {leader.name}
                                </Box>
                                <Box textAlign="center" fontWeight="fontWeightLight" fontSize={14} fontFamily="Segoe UI">
                                    {`${leader.score} ms`}
                                </Box>
                            </Typography>
                        </Grid>
                    ))
                }
                </Grid>
                <Divider style={{margin: "15px"}} />
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="Add"
                    onClick={this.newRoom}
                    style={{
                        margin: "20px auto",
                        display: "block"
                    }}
                >
                    NEW ROOM       
                </Fab>
                    <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                {
                    this.state.rooms.map(room => (
                        <Grid item>
                            <RoomCard 
                                room={room}
                            />
                        </Grid>
                    ))
                }
                </Grid>
            </div>                
        )
    }
}

export default withRouter(Home)

