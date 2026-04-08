import React, { useState } from 'react';
import AIChatWindow from "./AIChatWindow";
import axios from "axios";
import "./ai.css";

export default function AIFloatingButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                className='ai-float-btn'
                onClick={() => setOpen(!open)}
            >🤖</div>

            {open && <AIChatWindow onClose={() => setOpen(false)} />}
        </>
    );
}