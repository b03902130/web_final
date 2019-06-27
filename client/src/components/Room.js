import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import Play from './Play'
import openSocket from 'socket.io-client'
import axios from 'axios'

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
            this.leave()
        }

        // Handling socket
        this.socket = openSocket()
        if (this.socket !== undefined) {
            this.socket.on('err', data => {
                alert(data)
            })
            this.socket.on('resRoomInfo', data => {
                this.setState({roominfo: data})
            })
            this.socket.on('kickout', data => {
                alert('This room is not available currently')
                this.props.history.push('/');
            })
            this.socket.on('players', data => {
                this.setState({players: data})
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
        let userid = localStorage.getItem('id')
        let roomid = this.props.match.params.roomid
        if (userid === 'undefined' || roomid === undefined) {
            alert('Data not complete')
        } else {
            this.socket.emit('leave', {
                userid: userid,
                roomid: roomid
            })
        }
    }

    render() {
        return ( !this.state.roominfo ? 
            <h3>Loading</h3>
            :
            <div>
                <h1>{this.state.roominfo.name}</h1>    
                {
                    this.state.players.map(player => (
                        <div>
                            <p><strong>{player.name}</strong></p>
                        </div>
                    ))
                }
                {/* this.state.active ? <Play /> */}
                {/* : */} 
                {/* <div> */}
                {/*     { */}
                {/*         this.state.players.map(player => ( */}
                {/*             <div> */}
                {/*                 <h3>{player.name}</h3> */}
                {/*             </div> */}
                {/*         )) */}
                {/*     } */}
                {/*     <button onClick={() => {this.setState({status: 'entering'})}}>Play</button> */}
                {/* </div> */}
                {/* <h3>The room is closed<h3> */}
            </div>
        )
    }
} 
        
export default withRouter(Room)


