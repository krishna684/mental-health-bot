import { useState, useRef, useEffect } from "react";
import MorphingBlob from "../components/MorphingBlob";
import { AnimatePresence, motion } from "framer-motion";






export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [mood, setMood] = useState("");
  const [moodLog, setMoodLog] = useState([]);
  const [started, setStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef(null);


  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    setStarted(true);

    const userMsg = { role: "user", content: messageToSend };
    setChat((prev) => [...prev, userMsg]);

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageToSend }),
    });

    const data = await res.json();
    const botMsg = { role: "assistant", content: data.reply };
    setChat((prev) => [...prev, botMsg]);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
    <AnimatePresence>
      {!started && (
        <motion.div
          key="welcome"
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <MorphingBlob />
          <h1 className="text-2xl font-bold text-center">
            Mental Health Check-in Bot
          </h1>
          <p className="text-sm text-gray-300">How are you feeling?</p>
          <div className="flex gap-4">
            {["😔", "😐", "😊"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  setMood(emoji);
                  setMoodLog((prev) => [...prev, { mood: emoji, time: timestamp }]);
                  sendMessage(`I'm feeling ${emoji}`);
                }}
                className={`text-3xl hover:scale-125 transition ${
                  mood === emoji ? "ring-2 ring-pink-400 rounded-full" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="w-full max-w-sm relative">
          
          
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Type something to begin..."
    className="w-full p-3 pr-12 rounded-xl bg-gray-900 text-white border border-gray-700 outline-none"
  />
  <button
    onClick={() => sendMessage()}
    className="absolute right-3 top-1/2 -translate-y-1/2"
    aria-label="Send"
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M35 25 Q33 50 35 75 Q65 60 65 50 Q65 40 35 25 Z"
        stroke="url(#gradient)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
</div>



        </motion.div>
      )}
    </AnimatePresence>
  
    {started && (
      <motion.div
        key="chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Buttons */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => {
              setStarted(false);
              setInput("");
              setShowHistory(false);
            }}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            🔙 Back
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            📜 {showHistory ? "Hide" : "Show"} History
          </button>
        </div>
  
        {/* Chat Box */}
<div className="h-[60vh] overflow-y-auto bg-gray-900 p-6 rounded-xl shadow-inner space-y-4">
  {chat.map((msg, i) => (
    <div
      key={i}
      className={`px-4 py-2 rounded-xl text-sm whitespace-pre-wrap break-words ${
        msg.role === "user"
          ? "ml-auto bg-blue-600 text-white text-right"
          : "mr-auto bg-gray-700 text-gray-200"
      }`}
      style={{
        maxWidth: "80%",
        width: "fit-content",
        wordWrap: "break-word",
      }}
    >
      {msg.content}
    </div>
  ))}
  <div ref={chatEndRef} />
</div>


  
        {/* Chat Input */}
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Your message..."
            className="flex-grow p-3 rounded-l-xl bg-gray-800 text-white border border-gray-600"
          />
          <button
            onClick={() => sendMessage()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-r-xl"
          >
            Send
          </button>
        </div>
  
        {/* History Toggle */}
        {showHistory && (
  <div className="bg-gray-800 rounded-xl p-4 mt-4 text-sm space-y-6">
    {/* Mood Log */}
    <div>
      <h2 className="font-semibold mb-2">🧠 Mood History</h2>
      {moodLog.length === 0 ? (
        <p className="text-gray-400">No moods recorded yet.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {moodLog.map((entry, i) => (
            <li key={i}>
              {entry.mood} —{" "}
              <span className="text-gray-400">{entry.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Chat Log */}
    <div>
      <h2 className="font-semibold mb-2">💬 Chat History</h2>
      {chat.length === 0 ? (
        <p className="text-gray-400">No chat yet.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`text-sm p-2 rounded-md ${
                msg.role === "user"
                  ? "bg-blue-600 text-white text-right ml-auto w-fit"
                  : "bg-gray-700 text-gray-100 mr-auto w-fit"
              }`}
            >
              <span className="block">{msg.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      </motion.div>
    )}
  </div>
  
  );
}
