import React from 'react';
import { useEffect, useState, useRef } from 'react';
import {Avatar} from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import './Chat.css';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase';

function Chat({ username }) {

    const[seed, setSeed] = useState("");
    const[input, setInput] = useState("");
    const {roomId} = useParams();
    const[roomName, setRoomName] = useState("Select a room to Chat");
    const[messages, setMessages] = useState([]);
    const scroll = useRef();

    useEffect(()=>{
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp","asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        }
    },[roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        // console.log("You typed >>")
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        scroll.current.scrollIntoView({behavior: 'smooth'})
        setInput("");
    }

    return (
        <div className="chat">
            <div className="chat_header">
               <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {new Date(messages[messages.length-1]?.timestamp?.toDate()).toLocaleTimeString()}</p>
                </div>
                <div className="chat_headerRight">
                    <IconButton><SearchOutlinedIcon/></IconButton>
                    <IconButton><AttachFileIcon/></IconButton>
                    <IconButton><MoreVertIcon/></IconButton>
                </div>
            </div>

            <div className="chat_body">
                {/* <ReactScrollFeed> */}
                {messages.map((message) => (
                    <p className={`chat_message ${message.name === username && `chat_reciever`}`}>
                    <span className="chat_name">{message.name}</span>
                    {message.message}<span className="chat_timestamp">{new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
                    </p>
                ))}
                <div ref={scroll}></div>              
                {/* </ReactScrollFeed>   */}
            </div>

            <div className="chat_footer">
                <InsertEmoticonIcon className="micIcon"/>
                <form>
                    <input value={input} onChange={(e)=>setInput(e.target.value)}
                    placeholder="Type a message"
                    type="text"/>
                    <Button disabled={!input} onClick={sendMessage} type="submit" variant="contained" className="micIcon" color="primary" endIcon={<SendIcon/>} size="small">Send</Button>
                </form>
                <IconButton><MicIcon className="micIcon"/></IconButton>
            </div>
        </div>
    )
}

export default Chat
