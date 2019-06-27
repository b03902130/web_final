import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import axios from 'axios'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: []
        }
    }

    componentDidMount() {
        axios.get(window.env.backend + 'rooms')
            .then(res => {
                this.setState({rooms: res.data})
            })
            .catch(err => {
                alert('Error in Home.js')
                debugger
            })
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
            <div>
                <button onClick={this.newRoom}>NEW ROOM</button>
                {
                    this.state.rooms.map(room => (
                        <div>
                            <h3>{room.name}</h3>
                            <p>active: {room.active.toString()}</p>
                            <p>{`${room.player_num} players are in this room`}</p>
                            <Link to={`/rooms/${room.primary_k}`}>enter</Link>
                        </div>
                    ))
                }
            </div>                
        )
    }
}

export default withRouter(Home)

