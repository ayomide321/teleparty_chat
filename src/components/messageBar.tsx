import React from "react";
import { FormEvent, useState, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import { SocketMessageTypes, TelepartyClient } from "teleparty-websocket-lib";


type Props = {
    client: TelepartyClient
}

const MessageBar: React.FunctionComponent<Props> = ({client}) => {
    const [message, setMessage] = useState('');

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
            body: message
        })
        setMessage('')
    }

    const onMessageTyping = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.currentTarget.value)
        client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
            typing: true
        });
    }

    return(
        <>
            <form onSubmit={sendMessage}>
                <input type="text" style={{width: '80%', bottom: 0}} onChange={onMessageTyping} value={message} />
                <button className = "sendText" type="submit">Send</button>
            </form>
        </>
    )
}

export default MessageBar