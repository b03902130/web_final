import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import axios from 'axios'
import {
    Grid,
    Fab
} from '@material-ui/core'
import RoomCard from './RoomCard'

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

