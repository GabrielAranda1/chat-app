import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'
import Infobar from './../Infobar/Infobar'
import Input from './../Input/Input'
import Messages from './../Messages/Messages'

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'https://ga-nodejs-chat.herokuapp.com/'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)

        socket.emit('join', { name, room }, () => {                          // socket.emit('join', {name: name, room: room})

        })

        return () => {
            socket.emit('disconnect')

            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])                 // adds new message to message array
        }, [messages])                                    // run this useEffect only when "messages" changes
    })

    // function for sending messages 
    const sendMessage = (event) => {

        event.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat