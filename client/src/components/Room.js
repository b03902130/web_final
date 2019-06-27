import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import openSocket from 'socket.io-client'

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roominfo: null,
            players: [],
            timer: 3,
            play: false,
            players_speed: {}
        }
        this.socket = undefined
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
            this.socket.on('error', data => {
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
                let speeds = {}
                this.state.players.forEach(player => {
                    speeds[player.id] = 10
                })
                this.setState(state => ({roominfo: {...state.roominfo, active: true}, players_speed: speeds}))
                this.interval = window.setInterval(() => {this.countdown()}, 1000)
            })
            this.socket.on('step', data => {
                let playerid = parseInt(data.id)
                let amount = data.step
                this.setState(state => {
                    let player = state.players.find(player => player.id === playerid)
                    return {
                        players_speed: {
                            ...state.players_speed,
                            [player.id]: state.players_speed[player.id] + amount
                        }
                    }
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
        let id = parseInt(localStorage.getItem('id'))
        let ids = this.state.players.map(player => player.id)
        if (ids.includes(id)) {
            console.log('componentWillUnmount')
            // debugger
            this.leave()
        }
        window.onbeforeunload = null 
    }
    
    countdown = () => {
        this.setState(state => {
            let newTimer = state.timer - 1
            if (newTimer === 0) {
                window.clearInterval(this.interval)
            }
            return {timer: newTimer}
        })
    }

    enter = () => {
        let userid = localStorage.getItem('id')
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
        let userid = localStorage.getItem('id')
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

    speedup = (amount) => { 
        this.socket.emit('step', {
            roomid: this.props.match.params.roomid,
            userid: localStorage.getItem('id'),
            step: amount
        })
    }

    render() {
        return ( !this.state.roominfo ? 
            <h3>Loading</h3>
            :
            !this.state.roominfo.active ?
                <div>
                    <h1>{this.state.roominfo.name}</h1>    
                    <button onClick={this.start}>start</button>    
                    {
                        this.state.players.map(player => (
                            <div>
                                <p><strong>{player.name}</strong></p>
                            </div>
                        ))
                    }
                </div>
                :
                <div>
                    { this.state.timer > 0 ?
                        <h1>{this.state.timer}</h1>
                        :    
                        <h1>GO! Speed {this.state.speed}</h1>
                    }
                    <button onClick={err => {this.speedup(10)}}>speedup</button>
                    <h1>{this.state.roominfo.name}</h1>
                    {
                        this.state.players.map(player => (
                            <div>
                                <p><strong>{player.name}</strong></p>
                                <p>{this.state.players_speed[player.id]}</p>
                            </div>        
                        ))
                    }
                </div>
        )
    }
} 
        
export default withRouter(Room)


