import React from "react";
import { MessageList } from 'teleparty-websocket-lib';
import './messageData.css'
type Props = {
    messages: MessageList
    roomID: string
}

const MessageData: React.FunctionComponent<Props> = ({messages, roomID}) => (

    <>
        <ul className = "messagePage">
            <p style={{textAlign: 'center', fontWeight: 'bolder'}}>Invite your friends to join with this code: {roomID}</p>
            {messages.messages ? messages.messages.map((message, i) => (
                <li className="messageData" key={i}>
                
                {message.isSystemMessage ? 
                
                <p style={{textAlign: 'center', color: '#850101'}}><b>{message.userNickname ? message.userNickname : "AnonymousUser"} {message.body}</b></p>
                :
                    <p><b>{message.userNickname ? message.userNickname : "AnonymousUser"}:</b> {message.body}</p>}
                </li>
            ) 
        
        ) : <p>No messages</p>}
        
        </ul>
    </>
)


export default MessageData