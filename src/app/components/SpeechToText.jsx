"use client";

import { useEffect, useRef, useState } from "react";

export default function SpeechToText() {
    const recognitionRef = useRef < any > (null);
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window ).SpeechRecognition ||
            (window ).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Browser tidak support Web Speech API");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "id-ID";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalText = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                }
            }

            if (finalText) {
                setTranscript((prev) => prev + " " + finalText);
                console.log("Transkrip:", finalText);
            }
        };

        recognition.onerror = (err) => {
            console.error("Speech error:", err);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = () => {
        recognitionRef.current?.start();
        setListening(true);
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return (
        <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Live Speech-to-Text</h2>

            <div className="flex gap-2 mb-3">
                <button onClick={startListening} disabled={listening}>
                    🎤 Start
                </button>
                <button onClick={stopListening} disabled={!listening}>
                    ⏹ Stop
                </button>
            </div>

            <div className="bg-gray-100 p-2 min-h-[80px]">
                {transcript || "Belum ada suara..."}
            </div>
        </div>
    );
}
