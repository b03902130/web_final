import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import openSocket from 'socket.io-client'

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roominfo: null,
            players: [],
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
                this.setState(state => ({roominfo: {...state.roominfo, active: true}}))
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
    }
    
    start = () => {
        this.socket.emit('start', {roomid: this.props.match.params.roomid})
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
                    <h1>Play</h1>
                    <h1>{this.state.roominfo.name}</h1>
                    {
                        this.state.players.map(player => (
                            <p>{player.name}</p>
                        ))
                    }
                </div>
        )
    }
} 
        
export default withRouter(Room)


