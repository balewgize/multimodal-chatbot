import React, { useState, useEffect, useRef } from "react";

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([]);
    const mediaRecorderRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
        // Cleanup on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        socketRef.current = new WebSocket("ws://localhost:8000/process-audio/");

        socketRef.current.onmessage = (event) => {
            const text = event.data;
            setMessages((prevMessages) => [...prevMessages, text]);
        };

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0 && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(event.data);
            }
        };

        mediaRecorderRef.current.start(1000); // Send audio chunks every second
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        if (socketRef.current) {
            socketRef.current.close();
        }
    };

    return (
        <div>
            <button onClick={() => setIsRecording(true)}>Start Recording</button>
            <button onClick={() => setIsRecording(false)}>Stop Recording</button>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </div>
    );
};

export default AudioRecorder;
