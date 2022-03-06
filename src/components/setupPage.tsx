import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import './setupPage.css'
import { TelepartyClient, SocketEventHandler, MessageList } from 'teleparty-websocket-lib';
import ChatRoom from './chatRoom';


const SetupPage: React.FunctionComponent = () => {
    const localNickName = window.sessionStorage.getItem('nickName') || ''
    const localRoomID = window.sessionStorage.getItem('roomId') || ''
    const [nickname, setNickName] = useState(localNickName);
    const [typers, setTypers] = useState(false);
    const [chatID, setchatID] = useState(localRoomID);
    const [errorMessage, setError] = useState('');
    const [messages, setMessages] = useState<MessageList>({messages: []} as MessageList);
    const [inRoom, setInRoom] = useState(false)
    const eventHandler: SocketEventHandler = {
        onConnectionReady: async () => { 
            console.log('Socket has been created')
            setchatID((chatId) => ((chatId) = window.sessionStorage.getItem('roomId') || ""))
            setNickName((nickname) => ((nickname) = window.sessionStorage.getItem('nickName') || ""))
            try{
                if(chatID){
                    await client.current.joinChatRoom(nickname, chatID)
                    setInRoom(true)
                }
            } catch(err) {
                console.log(err)
                window.sessionStorage.setItem('roomId', '')
                setchatID('')
                setError("Sorry, your chat no longer exists.")
                
            }
         },

        onClose: () => { console.log("Socket closed") },
        onMessage: async(message) => {
            console.log(message.data)
            if(message.data.anyoneTyping){
                setTypers(message.data.anyoneTyping)
            } else if(message.data.body) {
                setMessages((oldMessages) => ({...oldMessages, messages: oldMessages.messages.concat(message.data)}))
                setTypers(false)
            }
        }
    };
    const client = useRef<TelepartyClient>({} as TelepartyClient)

   
    //Each time page reloads run this hook
    useEffect(() => {
        
        //Initialize the client
        async function initalizeClient() {
            
            client.current = await new TelepartyClient(eventHandler)
        }
        const typerIntervals = setInterval(() => setTypers(false), 1000)
        initalizeClient();

        return () => clearInterval(typerIntervals) 

    }, [])
    
    const exitChat = () => {
        window.sessionStorage.setItem('roomId', '');
        setInRoom(false)
        window.location.reload();
    }
    //Send user to the chat
    const createChat = async(event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(!nickname) {
            setError("You need to set a nickname")
            return;
        }
        try{
            let roomId = await client.current.createChatRoom(nickname);
            window.sessionStorage.setItem('roomId', roomId)
            setInRoom(true)
            setchatID(roomId)
            
            //navigate('/chat', {state: {client: client.current, id: roomId} })
            
        } catch(err) {
            setError("There was an error in creating your chat room, please try again")
        }
        //spawn a new chat ID
        //save to list
        //open chat window 
    }

    const joinChat = async(event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(!nickname) {
            setError("You need to set a nickname")
            return;
        }
        try{
            await client.current.joinChatRoom(nickname, chatID);
            setInRoom(true)
            window.sessionStorage.setItem('roomId', chatID)
        } catch(err) {
            console.log(err)
            setError("There was no room with this ID")
            window.sessionStorage.setItem('roomId', '')
        }
    }
    const onIDChange = (event: ChangeEvent<HTMLInputElement>) => {
        setchatID(event.currentTarget.value)
        setError('');
    }

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNickName(event.currentTarget.value)
        window.sessionStorage.setItem('nickName', event.currentTarget.value)
    }

    return (
        <>
        { inRoom ? <ChatRoom exitChat = {exitChat} client={client.current} roomID={chatID} messages={messages} typers={typers}/> :
            <div className = "setupContainer">
                <h1>Teleparty Chat Extension</h1>
                <hr className = 'Solid'/>
                <h3>Enter Nickname</h3>
                <input required onChange = {onNameChange} value={nickname} placeholder = 'ENTER NICKNAME' />

                <hr className = 'Solid' />
                <button className = "button createButton"
                onClick={createChat}>Create Chat</button>
                <h3>OR</h3>
                <input className = "id" onChange={onIDChange} value={chatID} placeholder='ENTER CHAT ID'/>
                <button className = "button joinButton"
                onClick={joinChat}>Join Chat</button>
            
            {errorMessage && (<h3 className="error"> {errorMessage} </h3>) }
            </div> 
        }
        </>
    )

}

export default SetupPage
