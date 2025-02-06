import { useEffect, useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SyncLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function App() {
  const apiKey = import.meta.env.VITE_API_GEMINI_KEY;

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([
    {
      prompt: "Hello, how can I help you today?",
      response: "I am a chatbot, ask me anything.",
    },
  ]);

  let [loading, setLoading] = useState(false);

  async function fetchChatResponseFromGemini() {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const newResponse = [
      ...response,
      { prompt: prompt, response: result.response.text() },
    ];
    setResponse(newResponse);
    setPrompt("");
    setLoading(false);
    localStorage.setItem('chatbotResponse', JSON.stringify(newResponse));
  }

  function clearChatHistory() {
    setResponse([]);
    localStorage.removeItem('chatbotResponse');
  }

  useEffect(() => {
    const data = localStorage.getItem('chatbotResponse');
    if (data) {
      setResponse(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <h1 className="heading">~AI Chat Bot~</h1>
      <div className="chatbot_container">
        <div className="chatbot_response_container">
          {response?.map((res, index) => (
            <div key={index} className="response">
              <p className="chatbot_prompt">
                {res.prompt}
              </p>
              <p className="chatbot_response">
                {res.response}
              </p>
            </div>
          ))}

          {loading && (
            <SyncLoader
              color={"chocolate"}
              loading={loading}
              cssOverride={override}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </div>

        <div className="chatbot_input">
         <button id="clear" type="button" onClick={clearChatHistory}> clear chat </button>
          <input
            type="text"
            name="input"
            placeholder="enter your questions"
            className="input"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <button id="submit" type="button" onClick={fetchChatResponseFromGemini}> submit </button>
          
          
        </div>
      </div>
    </>
  );
}

export default App;

