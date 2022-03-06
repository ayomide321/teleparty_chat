import React, { useEffect, useRef } from "react";
import MessageBar from "./messageBar";
import MessageData from "./messageData";
import { MessageList, TelepartyClient } from 'teleparty-websocket-lib';
import './chatRoom.css'

type Props = {
    messages?: MessageList
    client?: TelepartyClient
    exitChat?: (React.MouseEventHandler<HTMLButtonElement>);
    typers?: boolean
    roomID?: string
}

const ChatRoom: React.FunctionComponent<Props> = ({messages, client, exitChat, typers, roomID}) => {
    const listRef = useRef<HTMLDivElement>({} as HTMLDivElement);
    useEffect(() => {
        listRef.current.scrollTo(0, listRef.current.scrollHeight);
    }, [messages]);


    //<p style={{}}>{userTyping.usersTyping} is typing...</p>
    return(
    <>
        <div className="chatRoomContainer">
            <div className = "chatRoom" ref={listRef} key={messages && messages.messages ? messages.messages.length : 0}>
                <MessageData roomID={roomID!} messages={messages ? messages : {} as MessageList}/> 
                
            </div>
            <p style={typers ? {bottom: 0, position: "sticky", opacity: 1} : {opacity: 0}}>Users are typing...</p>
            <MessageBar client={client!}/>
            <button onClick={exitChat}>Exit Chat</button>
        </div>
        
    </>
        )
}

export default ChatRoom