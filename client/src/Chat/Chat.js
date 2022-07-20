import React from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';

export default class Chat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chat:[],
        }
    }

    componentDidMount(){
        //this.latestChat.current = this.state.chat;
        const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:5001/hubs/chat')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(result => {
            console.log('Connected!');

            connection.on('ReceiveMessage', message => {
                const updatedChat = [...this.state.chat];
                updatedChat.push(message);
                console.log("messaged received!!",message);
                this.setState({chat:updatedChat})
                // setChat(updatedChat);
            });
        })
        .catch(e => console.log('Connection failed: ', e));
    }

    sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: message
        };

        try {
            await  fetch('https://localhost:5001/chat/messages', { 
                method: 'POST', 
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch(e) {
            console.log('Sending message failed.', e);
        }
    }

    render(){
        return(
            <div>
                <ChatInput sendMessage={this.sendMessage} />
                <hr />
                <ChatWindow chat={this.state.chat}/>
            </div>
        );
    }
}

