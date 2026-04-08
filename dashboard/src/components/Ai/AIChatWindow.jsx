import React, { useState } from 'react';
import "./ai.css";
import axios from "axios";

export default function AIChatWindow({ onClose }){
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading , setLoading] = useState(false);

    const sendMessage = async (customInput) => {
        const message = typeof customInput === "string" ? customInput : input;
        if(!message.trim()) return;

        const userMsg = {
            role: "user",
            text: message
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try{
            const res = await axios.post(
                `https://finance-clone-4azm.onrender.com/api/ai/chat`,
                {query: message},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            const aiMsg = {
                role: "ai",
                text: res.data.message
            };
            setMessages((prev) => [...prev, aiMsg]);
        }catch(err) {
            console.log(err);
        }
        setLoading(false);
    };

    const sendQuick = async (text) => {
        await sendMessage(text);
    };

    return(
        <div className='ai-chat-window'>
            {/* Header */}
            <div className='ai-header'>
                <span>AI Copilot</span>
                <button className='btn btn-sm btn-light' onClick={onClose}>X</button>
            </div>
            {/* Messages */}
            <div className='ai-messages'>
                {messages.map((m,i) => (
                    <div key={i}
                        className={`ai-msg ${m.role === "user" ? "ai-user" : "ai-bot"}`}
                    >
                        {m.text}    
                    </div>
                ))}
                {loading && <div className='ai-loading'>Thinking...</div>}
            </div>
            {/* Quick Suggestions */}
            <div className="px-2 pb-2">
                <button
                    disabled={loading}
                    className="btn btn-sm btn-light me-2 mb-2"
                    onClick={() => sendQuick("Analyze my portfolio")}
                >
                    Analyze
                </button>

                <button
                    disabled={loading}
                    className="btn btn-sm btn-light me-2 mb-2"
                    onClick={() => sendQuick("Which stock is risky?")}
                >
                    Risk
                </button>

                <button
                    disabled={loading}
                    className="btn btn-sm btn-light mb-2"
                    onClick={() => sendQuick("Should I sell my worst stock?")}
                >
                    Sell Advice
                </button>
            </div>
            {/* Input */}
            <div className='ai-input-box'>
                <input 
                    className='form-control'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Ask Something...'
                />
                <button className='btn btn-primary' onClick={() => sendMessage()}>
                    Send
                </button>
            </div>
        </div>
    );
}